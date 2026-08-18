import {
  Worker,
  isMainThread,
  parentPort,
} from 'node:worker_threads';

if (isMainThread) {
    // 主线程
    const worker = new Worker(__filename);
    worker.on("message", (msg) => console.log("主线程收到：", msg));
    worker.postMessage("Hello Worker!");
} else {
    // 工作线程
    parentPort.on("message", (msg) => {
        console.log("工作线程收到：", msg);
        parentPort.postMessage("Hello Main!");
    });
}
