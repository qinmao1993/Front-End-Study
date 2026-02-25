# TextEncoder|TextDecoder
TextEncoder 是 Web API 的一部分，用于将 JavaScript 字符串转换为 UTF-8 编码的字节序列。它是处理文本和二进制数据之间转换的重要工具。
## 注意
* TextEncoder 仅支持 UTF-8 编码
* 内存使用：大文本编码时注意内存消耗
* 性能考虑：频繁编码时重用 TextEncoder 实例
* 错误处理：编码失败时要有适当的错误处理机制
* 浏览器支持：现代浏览器都支持，但旧版本可能需要 polyfill

## 基本用法
  ```js
    // 创建 TextEncoder 实例
    const encoder = new TextEncoder();

    // 默认使用 UTF-8 编码
    console.log(encoder.encoding); // "utf-8"

    // 编码字符串为 Uint8Array
    const str = "Hello World!";
    const data = encoder.encode(str);
    console.log(data); // Uint8Array(12) [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]

  ```

## 应用场景
* base64 转换
  ```js
    function stringToBase64(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        
        // 将字节数组转换为二进制字符串
        const  binary=String.fromCharCode(data);
        
        return btoa(binary);
    }

    function base64ToString(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    }

    // 使用示例
    const base64 = stringToBase64('Hello, 世界!');
    console.log(base64); // "SGVsbG8sIOS4lueVjCE="
    console.log(base64ToString(base64)); // "Hello, 世界!"

  ```