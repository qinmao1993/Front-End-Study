# ResizeObserver

## 是什么？
  > 是一个 JS API，它提供了一个接口,可高性能地监听元素尺寸的变化。
* 为什么需要 ResizeObserver？—— 解决了什么问题？
  - 性能问题： 在它出现之前，通常需要通过监听全局的 window.resize 事件，然后通过其他方式（如获取元素的 offsetWidth 或使用 getBoundingClientRect()）来推断元素是否发生了变化，这种方法不仅笨重，而且性能很差。
  - 精准性问题：window.resize 无法告诉你哪个具体元素的尺寸变了。你需要手动遍历和比较所有可能受影响元素的尺寸，代码冗长且容易出错。

## 核心概念与基本用法
  ```js
   // 1. 创建观察者 (Creating an Observer)
   const observer = new ResizeObserver(callbackFunction);

   // callbackFunction 函数将在被观察的元素尺寸发生变化时被调用。
   // 回调函数接收两个参数：
   // entries: 一个 ResizeObserverEntry 对象的数组。每个被观察的元素发生尺寸变化时，都会对应一个 entry 对象。
   // observer: 调用该回调的 ResizeObserver 实例本身。

   // ResizeObserverEntry 对象,其常用属性有

   // entry.target: 引用尺寸发生变化的那个 DOM 元素。
   // entry.contentRect: 一个 DOMRectReadOnly 对象，提供了元素内容区域的尺寸和位置信息
   //  width: 内容区域的宽度（不含 padding, border, margin）
   //  height: 内容区域的高度
   //  x: 元素内容区域左上角相对于视口的 x 坐标（通常与 left 相同）。
   //  y: 元素内容区域左上角相对于视口的 y 坐标（通常与 top 相同）。
   //  top: 内容区域顶部相对于视口的 y 坐标。
   //  left: 内容区域左侧相对于视口的 x 坐标。
    
    function callbackFunction(entries, observer) {
        for (let entry of entries) {
            // 对每个发生变化的元素进行处理
            console.log(entry.target); // 变化的元素本身
            console.log(entry.contentRect); // 包含尺寸和位置信息的对象
        }
    }

   // 2. 开始和停止观察 (Observing and Unobserving)
   const myElement = document.getElementById('my-element');
   observer.observe(myElement);
   
   observer.unobserve(myElement);  // 停止观察一个特定的元素。

   observer.disconnect();         // 停止观察所有已观察的元素。通常在组件销毁或不再需要时调用

  ```

## 完整示例
  ```html
    <div id="resizable-box" style="width: 50%; height: 100px; background: lightblue; resize: both; overflow: auto;">
    拖动我来改变大小！
    </div>
    <p>宽度: <span id="width-display"></span>px</p>
    <p>高度: <span id="height-display"></span>px</p>

    <script>
    const box = document.getElementById('resizable-box');
    const widthDisplay = document.getElementById('width-display');
    const heightDisplay = document.getElementById('height-display');

    // 1. 创建观察者
    const resizeObserver = new ResizeObserver(entries => {
        // 2. 遍历所有发生变化的条目（这里我们只观察了一个元素）
        for (let entry of entries) {
        // 方法一：使用 contentRect (传统，但广泛支持)
        // widthDisplay.textContent = Math.round(entry.contentRect.width);
        // heightDisplay.textContent = Math.round(entry.contentRect.height);

        // 方法二：使用 borderBoxSize (现代，推荐)
        // 检查浏览器是否支持
        if (entry.borderBoxSize && entry.borderBoxSize.length > 0) {
            const borderBoxSize = entry.borderBoxSize[0];
            widthDisplay.textContent = Math.round(borderBoxSize.inlineSize);
            heightDisplay.textContent = Math.round(borderBoxSize.blockSize);
        } else {
            // 降级方案
            widthDisplay.textContent = Math.round(entry.contentRect.width);
            heightDisplay.textContent = Math.round(entry.contentRect.height);
        }
        }
    });
    // 3. 开始观察目标元素
    resizeObserver.observe(box);

    // 未来如果需要停止观察，可以调用：
    // resizeObserver.unobserve(box);
    // 或停止所有观察：
    // resizeObserver.disconnect();
    </script>
  ```

## 浏览器兼容性与 Polyfill
  - 兼容性: 所有现代浏览器（Chrome, Firefox, Safari, Edge）都已支持 ResizeObserver。对于旧版浏览器（如 IE），则需要使用 polyfill。
  - Polyfill: 可以使用 resize-observer-polyfill 库来在不支持的浏览器中实现类似功能。它通常使用 object 元素或 scroll 事件来模拟实现。

## 最佳实践与注意事项
* 性能优化:回调函数会频繁执行，因此内部的逻辑应尽可能轻量,如果需要执行复杂操作，可以使用 requestAnimationFrame 或 throttle 进行节流（但通常 ResizeObserver 本身已经做了优化，通常不需要额外节流）。
* 内存管理：在单页应用（SPA）中，当组件卸载时，务必调用 .unobserve() 或 .disconnect() 来移除观察者，防止内存泄漏。
* 初始调用：观察者会在你调用 .observe() 后立即触发一次回调，报告元素的当前尺寸。这非常有用，可以用于初始化状态。
