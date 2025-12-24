# Clipboard
 Clipboard API 是现代浏览器提供的异步剪贴板操作接口，允许 Web 应用安全地读写剪贴板内容。相比传统的 document.execCommand() 方法，它提供了更强大、更安全且异步的操作方式。

## 安全限制
* 在生产环境中需要 HTTPS 连接
* 部分操作需要用户主动交互（如点击）
* 权限提示：读取操作会向用户请求权限

## 核心 API
* navigator.clipboard 对象 
  - 这是访问剪贴板功能的主要入口点
  ```js
    // 写入剪贴板
    navigator.clipboard.writeText('要复制的文本')
    .then(() => console.log('文本已复制'))
    .catch(err => console.error('复制失败:', err));

    // 读取剪贴板
    navigator.clipboard.readText()
    .then(text => console.log('剪贴板内容:', text));

    // 写入文本
    async function writeTextToClipboard() {
        const text = 'Hello, Clipboard API!';
        const textBlob = new Blob([text], { type: 'text/plain' });
        
        const clipboardItem = new ClipboardItem({
            'text/plain': textBlob,
            'text/html': new Blob([`<b>${text}</b>`], { type: 'text/html' })
        });
        try {
            await navigator.clipboard.write([clipboardItem]);
            console.log('多种格式的数据已复制');
        } catch (err) {
            console.error('复制失败:', err);
        }
    }

    // 写入图片
    async function copyImageToClipboard(imageBlob) {
        const clipboardItem = new ClipboardItem({
            'image/png': imageBlob
        });
        
        try {
            await navigator.clipboard.write([clipboardItem]);
            console.log('图片已复制到剪贴板');
        } catch (err) {
            console.error('复制图片失败:', err);
        }
    }

    // 读取任意数据 - read()
    async function readClipboardData() {
        try {
            const clipboardItems = await navigator.clipboard.read();
            
            for (const item of clipboardItems) {
                // 遍历所有数据类型
                for (const type of item.types) {
                    const blob = await item.getType(type);
                    console.log(`类型: ${type}, 大小: ${blob.size} bytes`);
                    
                    if (type === 'text/plain') {
                        const text = await blob.text();
                        console.log('文本内容:', text);
                    }
                    
                    if (type.startsWith('image/')) {
                        // 处理图片数据
                        const imageUrl = URL.createObjectURL(blob);
                        console.log('图片URL:', imageUrl);
                    }
                }
            }
        } catch (err) {
            console.error('读取失败:', err);
        }
    }

  ```

## clipboard 三方库
* 安装
  ```bash
  npm i clipboard
  ```