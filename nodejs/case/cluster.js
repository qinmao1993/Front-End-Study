import cluster from "node:cluster";
import http from "node:http";
import { availableParallelism } from "node:os";

// v19.0.0+，用于获取系统可用的并行处理数量，os.cpus().length更准确，在容器化环境（如Docker）中，它会考虑CPU资源限制
const numCPUs = availableParallelism();

if (cluster.isPrimary) {
    console.log(`系统有 ${numCPUs} 个 CPU 核心`);

    console.log(`Primary ${process.pid} is running`);
    // 主进程：创建工作进程
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} 退出`);
    });
} else {
    // 子进程：启动HTTP服务
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end("Hello from Worker\n");
    }).listen(3000);
    console.log(`Worker ${process.pid} started`);
}
