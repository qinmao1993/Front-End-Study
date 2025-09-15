import {
    existsSync,
    mkdirSync,
    readFileSync,
    createWriteStream,
    unlink,
    writeFileSync,
} from "node:fs";
import { basename, join } from "node:path";
import https from "node:https";
import http from "node:http";

class BatchDownloader {
    constructor(options = {}) {
        this.successCount = 0;
        this.failCount = 0;
        this.failedItems = [];
        this.downloadDir = options.downloadDir || "./downloads";
        this.concurrentDownloads = options.concurrentDownloads ?? 3;
        this.activeDownloads = 0;
        this.queue = options.queue ? [...options.queue] : [];
    }
    // 创建下载目录
    createDownloadDir() {
        if (!existsSync(this.downloadDir)) {
            mkdirSync(this.downloadDir, { recursive: true });
            console.log(`创建下载目录: ${this.downloadDir}`);
        }
    }

    // 解析命令行参数
    parseArgs() {
        // console.log(`解析命令行参数:`,process.argv);
        const args = process.argv.slice(2);

        if (args.length === 0 || args.includes("--help")) {
            this.showHelp();
            process.exit(0);
        }

        for (let i = 0; i < args.length; i++) {
            if (args[i] === "--dir" && i + 1 < args.length) {
                this.downloadDir = args[i + 1];
                i++;
            } else if (args[i] === "--concurrent" && i + 1 < args.length) {
                this.concurrentDownloads = parseInt(args[i + 1]);
                i++;
            } else if (args[i] === "--file" && i + 1 < args.length) {
                this.loadUrlsFromFile(args[i + 1]);
                i++;
            } else if (!args[i].startsWith("--")) {
                this.queue.push(args[i]);
            }
        }
    }

    // 显示帮助信息
    showHelp() {
        console.log(`
        Node.js 批量文件下载器

        使用方法:
        node downloader.js [选项] [URL1] [URL2] ...

        选项:
        --file <路径>      从文件读取URL列表（每行一个URL）
        --dir <路径>       指定下载目录（默认: ./downloads）
        --concurrent <数字> 设置同时下载的文件数（默认: 3）
        --help            显示此帮助信息

        示例:
        node downloader.js --file urls.txt --dir ./myfiles
        node downloader.js https://example.com/file1.zip https://example.com/file2.pdf
        `);
    }

    // 从文件加载URL
    loadUrlsFromFile(filePath) {
        try {
            const data = readFileSync(filePath, "utf8");
            const urls = data
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0 && !line.startsWith("#")); // 支持注释

            this.queue = [...this.queue, ...urls];
            console.log(`从文件 ${filePath} 加载了 ${urls.length} 个URL`);
        } catch (error) {
            console.error(`无法读取文件 ${filePath}: ${error.message}`);
            process.exit(1);
        }
    }

    // 开始下载
    startDownload() {
        if (this.queue.length === 0) {
            console.log("没有要下载的文件");
            return;
        }

        this.createDownloadDir();
        console.log(
            `开始下载 ${this.queue.length} 个文件到 ${this.downloadDir}`
        );
        console.log(`并发下载数: ${this.concurrentDownloads}`);

        // 开始处理队列
        this.processQueue();
    }

    // 处理下载队列
    processQueue() {
        while (
            this.activeDownloads < this.concurrentDownloads &&
            this.queue.length > 0
        ) {
            const fileUrl = this.queue.shift();
            this.downloadFile(fileUrl);
            this.activeDownloads++;
        }

        // 检查是否所有下载都已完成
        if (this.activeDownloads === 0 && this.queue.length === 0) {
            this.finishDownload();
        }
    }

    // 下载单个文件
    downloadFile(fileUrl) {
        let parsedUrl;
        try {
            parsedUrl = new URL(fileUrl);
        } catch (err) {
            console.error(`无效的URL: ${fileUrl}`);
            this.handleDownloadFailure(fileUrl, "无效的URL");
            this.activeDownloads--;
            this.processQueue();
            return;
        }

        const filename = basename(parsedUrl.pathname);
        const filePath = join(this.downloadDir, filename);
        // 选择协议
        const protocol = parsedUrl.protocol === "https:" ? https : http;

        console.log(`开始下载: ${filename}`);

        const request = protocol
            .get(fileUrl, (response) => {
                if (response.statusCode !== 200) {
                    console.error(
                        `下载失败: ${filename} - HTTP状态码: ${response.statusCode}`
                    );
                    this.handleDownloadFailure(
                        fileUrl,
                        `HTTP状态码: ${response.statusCode}`
                    );
                    this.activeDownloads--;
                    this.processQueue();
                    return;
                }

                const fileStream = createWriteStream(filePath);
                const totalSize = parseInt(
                    response.headers["content-length"],
                    10
                );
                let downloadedSize = 0;

                response.on("data", (chunk) => {
                    downloadedSize += chunk.length;

                    // 显示下载进度
                    if (totalSize) {
                        const percent = (
                            (downloadedSize / totalSize) *
                            100
                        ).toFixed(1);
                        process.stdout.write(
                            `\r下载中: ${filename} - ${percent}% (${downloadedSize}/${totalSize} bytes)`
                        );
                    }
                });

                response.pipe(fileStream);

                fileStream.on("finish", () => {
                    fileStream.close();
                    console.log(`\n下载完成: ${filename}`);
                    this.successCount++;
                    this.activeDownloads--;
                    this.processQueue();
                });

                fileStream.on("error", (err) => {
                    console.error(
                        `\n文件写入错误: ${filename} - ${err.message}`
                    );
                    unlink(filePath, () => {}); // 删除不完整的文件
                    this.handleDownloadFailure(fileUrl, err.message);
                    this.activeDownloads--;
                    this.processQueue();
                });
            })
            .on("error", (err) => {
                console.error(`\n下载错误: ${filename} - ${err.message}`);
                this.handleDownloadFailure(fileUrl, err.message);
                this.activeDownloads--;
                this.processQueue();
            });

        // 设置超时
        request.setTimeout(30 * 1000, () => {
            console.error(`\n下载超时: ${filename}`);
            request.destroy();
            this.handleDownloadFailure(fileUrl, "超时");
            this.activeDownloads--;
            this.processQueue();
        });
    }

    // 处理下载失败
    handleDownloadFailure(fileUrl, reason) {
        this.failCount++;
        this.failedItems.push({ url: fileUrl, reason: reason });
    }

    // 完成下载
    finishDownload() {
        console.log("\n" + "=".repeat(50));
        console.log("下载完成!");
        console.log(`成功: ${this.successCount}, 失败: ${this.failCount}`);

        // 保存失败的下载项
        if (this.failedItems.length > 0) {
            const failedFilePath = join(
                this.downloadDir,
                "failed_downloads.json"
            );
            const failedData = JSON.stringify(this.failedItems, null, 2);

            writeFileSync(failedFilePath, failedData);
            console.log(`失败的下载项已保存到: ${failedFilePath}`);
        }
    }
}

// 启动下载器
const downloader = new BatchDownloader();
downloader.parseArgs();
downloader.startDownload();

// const downloader = new BatchDownloader({
//     downloadDir: './myfiles',
//     concurrentDownloads: 5,
//     queue: ['https://example.com/file1.zip']
// });

// # 下载单个文件
// node downloader.js https://example.com/file1.zip

// # 下载多个文件
// node downloader.js https://example.com/file1.zip https://example.com/file2.pdf

// # 从文件读取URL列表
// node downloader.js --file urls.txt --dir ./myfiles

// # 设置并发下载数
// node downloader.js --file urls.txt --concurrent 5

// # 显示帮助
// node downloader.js --help
