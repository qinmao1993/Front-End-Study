import http from "node:http";
import https from "node:https";

import http2 from "node:http2";
import { readFileSync,createReadStream } from "node:fs";
import { join } from "node:path";

const __dirname = new URL(".", import.meta.url).pathname;

// 读取证书和私钥
const options = {
    key: readFileSync("./secrets/private-key.pem"),
    cert: readFileSync("./secrets/public-certificate.pem"),
};

// 创建 http 服务器
const server = http.createServer((req, res) => {
    // req: http.IncomingMessage 对象（可读流），包含请求信息（URL, 方法, 头, 数据等）
    // res: http.ServerResponse 对象（可写流），用于构造并发送响应

    // 设置响应头
    // res.writeHead(200, { "Content-Type": "text/plain" });
    // 发送响应体
    // res.end("hello world\n");

    //   res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    //   res.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);

    // 创建可读流并管道传输到响应
    const readStream = createReadStream(join(__dirname, "index.html"));
    readStream.pipe(res);

    // 处理流错误
    readStream.on("error", (err) => {
        console.error("文件读取错误:", err);
        res.writeHead(500);
        res.end("服务器内部错误");
    });

});

// 创建 HTTPS 服务器，多了一个 `options` 参数
// const server = https.createServer(options, (req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('Hello World from HTTPS! This connection is secure.\n');
// });

// 创建 HTTP/2 服务器
// const server = http2.createSecureServer(options);
// server.on("stream", (stream, headers) => {
//     // 请求变成了一个 `stream`
//     // headers: 请求头对象

//     // 流响应
//     stream.respond({
//         "content-type": "text/html",
//         ":status": 200, // HTTP/2 使用伪头（pseudo-headers）
//     });

//     stream.end("<h1>Hello World from HTTP/2!</h1>");
// });

const PORT = 3000;
server.listen(PORT);
console.log("Server is running at https://127.0.0.1:" + PORT + "/");

// 也可以这样监听 'request' 事件，与上面 createServer 传参是等价的
// server.on('request', (req, res) => { ... });

server.on("error", (err) => {
    console.error("Server error:", err);
});

// 优雅关闭处理
process.on("SIGINT", () => {
    console.log("收到SIGTERM信号，开始关闭服务器");
    server.close(() => {
        console.log("服务器已关闭");
        process.exit(0);
    });
});
