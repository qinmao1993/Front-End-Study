import http from "node:http";
import htts from "node:https";
import { join, extname, resolve, normalize, relative } from "node:path";
import { createReadStream, promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";

// 静态服务器
// 使用说明:
//  - 启动: `node server.js`（默认端口 9000）
// 功能概览:
//  - 限制请求方法（只允许GET、HEAD等）
//  - 支持HTTPS（可选）
//  - 目录浏览（可选）
//  - 支持缓存设置
//  - 跨域（CORS）头设置（可选）
//  - 支持范围请求 (206, bytes)
//  - 支持 index 文件 (index.html/index.htm)
//  - 处理错误（如404，500等）
//  - 记录访问日志
//  - 处理路径安全，防止路径穿越攻击

// 导入配置和中间件
import config from "./config.js";
import mimeTypes from "./mime-types.js";

// 导入中间件
import SecurityMiddleware from "./middleware/security.js";
import CacheMiddleware  from './middleware/cache.js';
import CompressionMiddleware from "./middleware/compression.js";
import LoggerMiddleware from "./middleware/logger.js"

// 获取当前文件的绝对路径
const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

class StaticServer {
    constructor(config) {
        this.config = config;

        // 初始化中间件
        this.security = new SecurityMiddleware(config);
        this.compression = new CompressionMiddleware(config);
        this.cache = new CacheMiddleware(config);
        this.logger = new LoggerMiddleware(config);

        // 性能统计
        this.stats = {
            totalRequests: 0,
            totalBytes: 0,
            cacheHits: 0,
            cacheMisses: 0,
            compressionSavings: 0,
            startTime: Date.now(),
        };

        // 服务器实例
        this.server = null;
    }

    /**
     * 生成请求 ID
     */
    generateRequestId() {
        return randomBytes(16).toString("hex");
    }

    /**
     * 处理 HTTP 请求
     */
    async handleRequest(req, res) {
        const startTime = Date.now();
        const requestId = generateRequestId();

        // 设置请求 ID
        res.setHeader("X-Request-ID", requestId);

        // 安全中间件
        const securityResult = this.handleSecurity(req, res);
        if (securityResult === "handled") return;

        try {
            // 处理请求
            await this.processRequest(req, res);

            // 更新统计
            this.updateStats(res, startTime);
        } catch (error) {
            this.handleError(error, req, res, requestId);
        } finally {
            // 记录访问日志
            this.logger.logRequest(req, res, startTime, { requestId });
        }
    }

    /**
     * 处理安全相关中间件
     */
    handleSecurity(req, res) {
        // 设置安全头部
        this.security.setSecurityHeaders(res);

        // CORS 处理
        const corsResult = this.security.cors(req, res);
        if (corsResult === "handled") return "handled";

        // 速率限制
        const rateLimitResult = this.security.rateLimit(req, res);
        if (rateLimitResult === "limited") return "handled";

        // 只允许 GET 和 HEAD 方法
        if (!["GET", "HEAD"].includes(req.method)) {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    error: "Method Not Allowed",
                    message: `Method ${req.method} is not allowed for static resources`,
                }),
            );
            return "handled";
        }

        return null;
    }

    // 安全地将请求路径映射到文件系统路径，防止越权访问（../）
    // 返回 null 表示路径不安全或越界
    getSafeJoinPath(root, target) {
        // normalize + join 可移除路径中的 ./ ../ 等
        const np = normalize(join(root, target));
        // relative 用来判断 np 相对于 root 的相对路径
        const rel = relative(root, np);
        // 如果相对路径以 '..' 开头，说明越界；另外做一次额外检测以防 root 为空等情况
        if (rel.startsWith("..") || (rel === "" && !np.startsWith(root)))
            return null;
        return np;
    }

    /**
     * 处理请求主流程
     */
    async processRequest(req, res) {
        // 解析请求路径
        const url = new URL(req.url, `http://${req.headers.host}`);
        // 规范化路径
        const requestPath = url.pathname === "/" ? "/index.html" : url.pathname;
        // 解析文件路径
        const filePath = this.getSafeJoinPath(
            this.config.static.root,
            requestPath,
        );
        if (!filePath) {
            res.writeHead(403);
            return res.end("Forbidden");
        }

        // 检查文件是否存在
        // 获取文件信息（如果不存在会抛出 ENOENT）
        const stats = await fs.stat(filePath).catch((error) => {
            if (error.code === "ENOENT") {
                return null;
            }
        });

        // 处理目录请求
        if (stats && stats.isDirectory()) {
            await this.handleDirectory(req, res, filePath, requestPath);
            return;
        }

        // 处理文件请求
        if (stats && stats.isFile()) {
            await this.handleFile(req, res, filePath, stats);
            return;
        }

        // 文件不存在
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                error: "Not Found",
                message: `File ${requestPath} not found`,
            }),
        );
    }

    /**
     * 处理目录请求
     */
    async handleDirectory(req, res, dirPath, requestPath) {
        // 检查是否有默认文件
        for (const indexFile of this.config.static.index) {
            const indexPath = join(dirPath, indexFile);
            const indexStats = await fs.stat(indexPath).catch((error) => {
                if (error.code === "ENOENT") {
                    return null;
                }
            });

            if (indexStats && indexStats.isFile()) {
                await this.handleFile(req, res, indexPath, indexStats);
                return;
            }
        }

        // 检查是否启用目录浏览
        if (this.config.directory.enabled) {
            await this.handleDirectoryListing(req, res, dirPath, requestPath);
        } else {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    error: "Forbidden",
                    message: "Directory listing is not enabled",
                }),
            );
        }
    }

    /**
     * 生成目录列表 HTML
     */
    generateDirectoryHtml(items, dirPath, baseUrl) {
        const title = `Index of ${baseUrl}`;
        const parentUrl = path.dirname(baseUrl);

        let html = `<!DOCTYPE html>
            <html>
            <head>
            <title>${title}</title>
            <meta charset="utf-8">
            <style>
                body { font-family: sans-serif; margin: 40px; }
                h1 { color: #333; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
                a { text-decoration: none; color: #0366d6; }
                a:hover { text-decoration: underline; }
                .icon { margin-right: 8px; }
                .size { text-align: right; font-family: monospace; }
                .date { font-family: monospace; }
                .hidden { color: #999; }
            </style>
            </head>
            <body>
            <h1>${title}</h1>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th class="size">Size</th>
                    <th class="date">Last Modified</th>
                </tr>
                </thead>
                <tbody>`;

        // 父目录链接
        if (baseUrl !== "/") {
            html += `
            <tr>
                <td colspan="3">
                <a href="${parentUrl}">..</a>
                </td>
            </tr>`;
        }

        // 文件列表
        for (const item of items) {
            if (item.isHidden) continue;

            const icon = item.type === "directory" ? "📁" : "📄";
            const size =
                item.type === "directory"
                    ? "-"
                    : this.formatFileSize(item.size);
            const modified = item.modified.toLocaleString();
            const className = item.isHidden ? "hidden" : "";

            html += `
                <tr class="${className}">
                    <td>
                    <span class="icon">${icon}</span>
                    <a href="${item.path}${item.type === "directory" ? "/" : ""}">${item.name}</a>
                    </td>
                    <td class="size">${size}</td>
                    <td class="date">${modified}</td>
                </tr>`;
        }

        html += `
            </tbody>
        </table>
        <footer style="margin-top: 20px; color: #666; font-size: 12px;">
            Node.js Static Server
        </footer>
        </body>
        </html>`;

        return html;
    }

    /**
     * 处理目录列表
     */
    async handleDirectoryListing(req, res, dirPath, requestPath) {
        try {
            const items = await this.fileUtils.getDirectoryListing(
                dirPath,
                requestPath,
            );
            const html = this.generateDirectoryHtml(
                items,
                dirPath,
                requestPath,
            );

            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8",
                "Content-Length": Buffer.byteLength(html),
            });

            res.end(html);
        } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    error: "Internal Server Error",
                    message: "Failed to generate directory listing",
                }),
            );
        }
    }

    /**
     * 处理文件请求
     */
    async handleFile(req, res, filePath, stats) {
        // 缓存验证
        if (this.cache.handleCacheValidation(req, res, stats)) {
            this.stats.cacheHits++;
            return;
        }

        this.stats.cacheMisses++;

        // 读取文件内容
        let content;
        try {
            content = await fs.readFile(filePath);
        } catch (error) {
            throw new Error(`Failed to read file: ${error.message}`);
        }

        // 处理 Range 请求
        const rangeResult = this.cache.handleRangeRequest(
            req,
            res,
            stats,
            content,
        );
        if (rangeResult.handled) return;

        content = rangeResult.content;

        // 获取 MIME 类型
        const ext = extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] ?? mimeTypes["default"];

        // 设置响应头
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Length", content.length);

        // 设置缓存头部
        this.cache.setCacheHeaders(res, filePath, stats);

        // 压缩内容
        let compressedResult;
        try {
            compressedResult = await this.compression.compressResponse(
                req,
                res,
                content,
                contentType,
            );
        } catch (error) {
            compressedResult = { content, encoding: null };
        }

        // 设置压缩头部
        this.compression.setCompressionHeaders(res, compressedResult.encoding);

        // 计算压缩节省
        if (compressedResult.encoding) {
            const savings = content.length - compressedResult.content.length;
            this.stats.compressionSavings += savings;
        }

        // 发送响应
        if (req.method === "HEAD") {
            res.writeHead(200);
            res.end();
        } else {
            res.writeHead(200);
            res.end(compressedResult.content);
        }
    }

    /**
     * 处理错误
     */
    handleError(error, req, res, requestId) {
        this.logger.logError(error, req, { requestId });

        const statusCode = error.statusCode || 500;
        const message =
            statusCode === 500 ? "Internal Server Error" : error.message;

        res.writeHead(statusCode, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                error: http.STATUS_CODES[statusCode],
                message,
                requestId,
            }),
        );
    }

    /**
     * 更新统计信息
     */
    updateStats(res, startTime) {
        this.stats.totalRequests++;

        const contentLength = parseInt(
            res.getHeader("content-length") || "0",
            10,
        );
        this.stats.totalBytes += contentLength;

        // 每100个请求记录一次统计
        if (this.stats.totalRequests % 100 === 0) {
            this.logStats();
        }
    }

    /**
     * 记录统计信息
     */
    logStats() {
        const uptime = Math.floor((Date.now() - this.stats.startTime) / 1000);
        const requestsPerSecond = (this.stats.totalRequests / uptime).toFixed(
            2,
        );
        const avgResponseSize = (
            this.stats.totalBytes / this.stats.totalRequests
        ).toFixed(2);
        const cacheHitRate = (
            (this.stats.cacheHits /
                (this.stats.cacheHits + this.stats.cacheMisses)) *
            100
        ).toFixed(1);

        const statsInfo = {
            uptime: `${uptime}s`,
            totalRequests: this.stats.totalRequests,
            requestsPerSecond,
            totalBytes: this.fileUtils.formatFileSize(this.stats.totalBytes),
            avgResponseSize: `${avgResponseSize} bytes`,
            cacheHitRate: `${cacheHitRate}%`,
            compressionSavings: this.fileUtils.formatFileSize(
                this.stats.compressionSavings,
            ),
        };

        this.logger.logStats(statsInfo);
    }

    /**
     * 启动服务器
     */
    async start() {
        // 检查根目录是否存在
        try {
            await fs.access(this.config.static.root);
        } catch (error) {
            console.warn(
                `Static directory "${this.config.static.root}" does not exist. Creating...`,
            );
            await fs.mkdir(this.config.static.root, { recursive: true });
        }
        // 创建服务器
        this.server = http.createServer(this.handleRequest.bind(this));

        // 启动服务器
        const { port, host } = this.config.server;
        return new Promise((resolve, reject) => {
            this.server.listen(port, host, () => {
                const address = this.server.address();
                //address: { port: 12346, family: 'IPv4', address: '127.0.0.1' }
                console.log("address:", address);
                console.log(`Static server running at http://${host}:${port}`);
                console.log("\nPress Ctrl+C to stop the server\n");
                resolve();
            });

            this.server.on("error", reject);
        });
    }

    /**
     * 停止服务器
     */
    async stop() {
        if (this.server) {
            return new Promise((resolve) => {
                this.server.close(() => {
                    console.log("Server stopped");
                    resolve();
                });
            });
        }
    }

    /**
     * 优雅关闭
     */
    async gracefulShutdown() {
        console.log("\nShutting down gracefully...");

        // 停止接受新连接
        this.server.close();

        // 等待现有连接关闭
        setTimeout(() => {
            console.log(
                "Could not close connections in time, forcefully shutting down",
            );
            process.exit(1);
        }, 10000).unref();

        // 记录最后的统计
        this.logStats();

        await this.stop();
        process.exit(0);
    }
}

// 主函数
async function main() {
    const server = new StaticServer(config);

    // 处理信号
    process.on("SIGTERM", () => server.gracefulShutdown());
    process.on("SIGINT", () => server.gracefulShutdown());

    // 处理未捕获异常
    process.on("uncaughtException", (error) => {
        console.error("Uncaught Exception:", error);
        server.gracefulShutdown();
    });

    process.on("unhandledRejection", (reason, promise) => {
        console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });

    try {
        await server.start();
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

// 判断是否为入口文件
function isMainModule() {
    // process.argv[1] 是当前执行的文件路径
    return import.meta?.main ?? process.argv[1] === __filename;
    
}

// 如果是直接运行，则启动
if (isMainModule()) {
    main();
}

export default StaticServer;
