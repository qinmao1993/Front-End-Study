// polling-worker.js

let pollingActive = false;

/**
 * 等待多少秒后继续执行，期间可被停止
 * @param {*} time 单位秒
 * @returns
 */
function wait(time = 1) {
    return new Promise((resolve) => setTimeout(resolve, time * 1000));
}

function formatTime(date) {
    return new Date(date)
        .toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        })
        .replace(/\//g, "-")
        .replace(/,/g, "");
}

async function poll() {
    while (pollingActive) {
        try {
            // const response = await fetch("/api/data");
            // const data = await response.json();
            const data = { timestamp: formatTime(Date.now()) }; // 模拟数据
            // 模拟耗时数据处理
            const processedData = expensiveProcess(data);
            self.postMessage({ type: "success", data: processedData });
        } catch (error) {
            self.postMessage({ type: "error", error: error.message });
        }
        // 等待 60 秒，但期间可被停止
        await wait();
    }
}

// 模拟耗时数据处理函数（仅作示例）
function expensiveProcess(data) {
    // 假设进行大量计算，例如遍历数组、复杂转换等
    if (Array.isArray(data)) {
        return data.map((item) => ({ ...item, processed: true }));
    }
    return data;
}

// 监听主线程发来的消息，用于启动或停止轮询
self.addEventListener("message", (event) => {
    const { command } = event.data;
    console.log(`Worker received command: ${command}`);
    if (command === "start" && !pollingActive) {
        pollingActive = true;
        poll(); // 启动轮询循环
    } else if (command === "stop") {
        // 设置一个标志来停止轮询
        // self.close(); // 注意：self.close() 会立即终止 Worker
        pollingActive = false; // 下次循环将退出
    }
});
