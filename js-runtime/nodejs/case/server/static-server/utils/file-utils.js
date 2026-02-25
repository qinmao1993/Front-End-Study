const fs = require("fs").promises;
const fsSync = require("fs");
const zlib = require("zlib");
const util = require("util");

const readdir = util.promisify(fsSync.readdir);

class FileUtils {
    /**
     * 检查文件是否存在
     */
    async fileExists(filePath) {
        return (await this.getFileStats(filePath)) !== null;
    }
    
    /**
     * 生成 ETag
     */
    generateETag(stats) {
        const mtime = stats.mtime.getTime().toString(16);
        const size = stats.size.toString(16);
        return `"${size}-${mtime}"`;
    }

    /**
     * 压缩内容
     */
    async compressContent(content, encoding) {
        const compressors = {
            gzip: util.promisify(zlib.gzip),
            deflate: util.promisify(zlib.deflate),
            br: util.promisify(zlib.brotliCompress),
        };

        if (compressors[encoding]) {
            try {
                return await compressors[encoding](content);
            } catch (error) {
                return null;
            }
        }

        return null;
    }

    /**
     * 获取支持的压缩类型
     */
    getAcceptedEncodings(acceptEncodingHeader) {
        if (!acceptEncodingHeader) return [];

        const encodings = [];
        const accepted = acceptEncodingHeader
            .toLowerCase()
            .split(",")
            .map((e) => e.trim());

        for (const encoding of accepted) {
            const [name, q = "1"] = encoding.split(";q=");
            if (name === "gzip" || name === "deflate" || name === "br") {
                encodings.push({
                    name,
                    quality: parseFloat(q),
                });
            }
        }

        // 按质量排序
        return encodings
            .sort((a, b) => b.quality - a.quality)
            .map((e) => e.name);
    }

    /**
     * 获取目录列表
     */
    async getDirectoryListing(dirPath, baseUrl) {
        const files = await readdir(dirPath, { withFileTypes: true });
        const items = [];

        for (const file of files) {
            const stats = await stat(path.join(dirPath, file.name));
            items.push({
                name: file.name,
                path: path.join(baseUrl, file.name),
                type: file.isDirectory() ? "directory" : "file",
                size: stats.size,
                modified: stats.mtime,
                isHidden: file.name.startsWith("."),
            });
        }

        // 排序：先目录后文件，按名称排序
        return items.sort((a, b) => {
            if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
            return a.name.localeCompare(b.name);
        });
    }

    /**
     * 格式化文件大小
     */
    formatFileSize(bytes) {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }
}
