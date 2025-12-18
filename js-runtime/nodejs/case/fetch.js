// GET 请求（获取数据）
async function fetchData() {
    try {
        const response = await fetch("https://api.example.com/data");

        // 检查请求是否成功 (HTTP 状态码在 200-299 之间)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 将响应体解析为 JSON
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Fetch failed:", error);
    }
}

async function postData() {
    try {
        const response = await fetch("https://api.example.com/data", {
            method: "POST", // 必须指定方法
            headers: {
                "Content-Type": "application/json", // 告诉服务器你发送的是 JSON
                // 其他可能的头部，如认证令牌
                // 'Authorization': 'Bearer your-token-here'
            },
            body: JSON.stringify({
                // 将 JavaScript 对象转换为 JSON 字符串
                name: "John Doe",
                age: 30,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json(); // 解析服务器返回的 JSON 响应
        console.log("Success:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}

async function fetchWithTimeout() {
    // 使用 AbortController 来设置请求超时
    // 这在 Node.js 18+ 和现代浏览器中均可用

    // 1. 创建一个 AbortController 实例
    const controller = new AbortController();
    const signal = controller.signal;

    // 2. 设置一个超时，5秒后自动取消请求
    setTimeout(() => controller.abort(), 5000);

    try {
        // 3. 将 signal 传递给 fetch 选项
        const response = await fetch("https://api.example.com/slow-endpoint", {
            signal: signal, // 在这里关联
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        // 4. 捕获因取消导致的错误
        if (error.name === "AbortError") {
            console.log("Request was aborted due to timeout");
        } else {
            console.error("Other error:", error);
        }
    }
}

async function uploadFile() {
    // 上传文件通常使用 FormData 对象
    // 在浏览器环境中，可以从 <input type="file"> 获取 File 对象
    // 在 Node.js 环境中，你可以自己构建 FormData（通常与 fs 模块读取文件配合）
    const FormData = require("form-data"); // 注意：Node.js 内置的 fetch 不支持 FormData，需要额外安装 'form-data' 包
    // 或者使用 fs.readFile 等方式

    const formData = new FormData();
    formData.append("username", "john");
    formData.append("avatar", fileBuffer, "avatar.jpg"); // 假设 fileBuffer 是文件内容的 Buffer

    const response = await fetch("https://api.example.com/upload", {
        method: "POST",
        body: formData,
        // headers: formData.getHeaders() // 如果使用 'form-data' 包，可能需要设置正确的 headers
    });
}

fetchData();

postData();
