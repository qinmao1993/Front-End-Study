import {
    readFileSync,
    writeFileSync,
    createReadStream,
    createWriteStream,
} from "node:fs";
import { createGunzip, createGzip, gzipSync } from "node:zlib";

// 同步 API - 适用于脚本或初始化
const input = readFileSync("config.json");
// 同步压缩
const compressed = gzipSync(input);
writeFileSync("config.json.gz", compressed);

// 同步解压
const compressedInput = readFileSync("config.json.gz");
const output = gunzipSync(compressedInput);
console.log(output.toString());

// 流（Stream API） - 适用于大文件（推荐）
// 创建可读流（源文件）
const src = createReadStream("large-video.mp4");

// 创建Gzip压缩流
const gzipStream = createGzip();

// 创建可写流（目标文件）
const dest = createWriteStream("large-video.mp4.gz");

// 使用管道（pipe）将数据流连接起来
// 源文件 -> 压缩 -> 目标文件
src.pipe(gzipStream).pipe(dest);

dest.on("finish", () => {
    console.log("文件压缩完成！");
});

// 在使用流时，一定要为所有流监听 'error' 事件，以防止进程因未处理的异常而崩溃。
src.on("error", (err) => {
    console.error("源文件读取错误:", err);
});
gzipStream.on("error", (err) => {
    console.error("压缩流错误:", err);
});
dest.on("error", (err) => {
    console.error("目标文件写入错误:", err);
});

// 解压缩：gunzip
const compressedSrc = createReadStream("large-video.mp4.gz");
const gunzipStream = createGunzip();
const extractDest = createWriteStream("extracted-video.mp4");

compressedSrc.pipe(gunzipStream).pipe(extractDest);
