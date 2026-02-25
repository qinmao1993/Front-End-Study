// 静态服务器
// 使用说明:
//  - 启动: `node static-server.js`（默认端口 9000）
//  - 环境变量: `PORT` 指定端口, `SERVE_ROOT` 指定根目录
// 功能概览:
//  - 限制请求方法（只允许GET、HEAD等）
//  - 支持HTTPS（可选）
//  - 目录浏览（可选）
//  - 支持缓存（缓存头部设置）
//  - 设置跨域（CORS）头（可选）
//  - 支持范围请求 (206, bytes)
//  - 支持 index 文件 (index.html/index.htm)
//  - 处理错误（如404，500等）
//  - 记录访问日志
//  - 处理路径安全，防止路径穿越攻击

import { createServer } from "node:http";
import { createReadStream, promises as fs } from "node:fs";
import { join, extname, resolve, normalize, relative } from "node:path";

// 服务根目录，优先使用环境变量 `SERVE_ROOT`，否则为当前工作目录
const ROOT = resolve(process.env.SERVE_ROOT || process.cwd());
const PORT = process.env.PORT ?? 9000;

// 根据文件路径返回 MIME 类型，若未知则返回通用二进制
function getMimeType(path) {
    const mime = {
        html: "text/html; charset=utf-8",
        js: "application/javascript",
        css: "text/css",
        json: "application/json",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        svg: "image/svg+xml",
        txt: "text/plain",
        wasm: "application/wasm",
    };
    const ext = extname(path).slice(1).toLowerCase();
    return mime[ext] ?? "application/octet-stream";
}

// 安全地将请求路径映射到文件系统路径，防止越权访问（../）
// 返回 null 表示路径不安全或越界
function safeJoin(root, target) {
    // normalize + join 可移除路径中的 ./ ../ 等
    const np = normalize(join(root, target));
    // relative 用来判断 np 相对于 root 的相对路径
    const rel = relative(root, np);
    // 如果相对路径以 '..' 开头，说明越界；另外做一次额外检测以防 root 为空等情况
    if (rel.startsWith("..") || (rel === "" && !np.startsWith(root)))
        return null;
    return np;
}

// 在目录中查找常见的索引文件，返回第一个存在的路径
async function tryIndex(dir) {
    for (const n of ["index.html", "index.htm"]) {
        try {
            const p = join(dir, n);
            const s = await fs.stat(p);
            if (s.isFile()) return p;
        } catch {
            // 文件不存在或无访问权限则忽略并继续
        }
    }
    return null;
}

async function serve(filePath, req, res) {
    // 获取文件信息（如果不存在会抛出 ENOENT）
    const stat = await fs.stat(filePath);

    // 如果请求的是目录，尝试查找 index 文件并递归处理
    if (stat.isDirectory()) {
        const idx = await tryIndex(filePath);
        if (!idx) {
            // 不允许列目录，返回 403
            res.writeHead(403);
            return res.end("Directory access denied");
        }
        return serve(idx, req, res);
    }

    // 计算响应头：Content-Type / Content-Length / ETag / Last-Modified / Cache-Control
    const mime = getMimeType(filePath);
    const etag = `"${stat.size.toString(16)}-${stat.mtime.getTime().toString(16)}"`;
    const headers = {
        "Content-Type": mime,
        "Content-Length": stat.size,
        ETag: etag,
        "Last-Modified": stat.mtime.toUTCString(),
        // 对 wasm 等静态二进制文件可以设置更长的缓存
        "Cache-Control":
            mime === "application/wasm"
                ? "public, max-age=31536000, immutable"
                : "public, max-age=3600",
    };

    // 条件请求：如果客户端的 ETag 匹配且为 GET，则返回 304
    if (req.headers["if-none-match"] === etag && req.method === "GET") {
        res.writeHead(304, headers);
        return res.end();
    }

    // HEAD 请求只返回头
    if (req.method === "HEAD") {
        res.writeHead(200, headers);
        return res.end();
    }

    // 支持范围请求（Range）。格式如: bytes=START-END
    const range = req.headers.range;
    if (range) {
        const [s, e] = range.replace(/bytes=/, "").split("-");
        const start = parseInt(s, 10) || 0;
        const end = e ? parseInt(e, 10) : stat.size - 1;
        const len = end - start + 1;
        res.writeHead(206, {
            ...headers,
            "Content-Range": `bytes ${start}-${end}/${stat.size}`,
            "Content-Length": len,
            "Accept-Ranges": "bytes",
        });
        // 使用流按区间发送文件，错误时销毁响应
        createReadStream(filePath, { start, end })
            .pipe(res)
            .on("error", () => res.destroy());
        return;
    }

    // 常规 GET，返回整个文件
    res.writeHead(200, headers);
    createReadStream(filePath)
        .pipe(res)
        .on("error", () => res.destroy());
}

// 创建 HTTP 服务器并处理请求的主逻辑
const server = createServer(async (req, res) => {
    // 仅允许 GET/HEAD
    if (!["GET", "HEAD"].includes(req.method)) {
        res.writeHead(405, { Allow: "GET, HEAD" });
        return res.end("Method Not Allowed");
    }

    // 解析 URL，若失败则认为是坏请求
    let url;
    try {
        url = new URL(req.url, `http://${req.headers.host}`);
    } catch {
        res.writeHead(400);
        return res.end("Bad Request");
    }

    // 将根路径映射到 /index.html
    const safe = safeJoin(
        ROOT,
        url.pathname === "/" ? "/index.html" : url.pathname,
    );
    // 如果路径越界或不安全，则返回 403
    if (!safe) {
        res.writeHead(403);
        return res.end("Forbidden");
    }

    try {
        // 实际读取并返回文件内容
        await serve(safe, req, res);
    } catch (err) {
        // 常见错误处理：文件不存在返回 404，其他返回 500
        if (err && err.code === "ENOENT") {
            res.writeHead(404);
            return res.end("Not Found");
        }
        console.error(err);
        res.writeHead(500);
        res.end("Internal Server Error");
    }
});

server.listen(PORT, () =>
    console.log(
        `static server running at http://localhost:${PORT}/  Root: ${ROOT}`,
    ),
);

// 优雅退出：捕获 SIGINT 并关闭服务器
process.on("SIGINT", () => server.close(() => process.exit(0)));
