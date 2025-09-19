# canvas

## Canvas 是什么？
* 定义：
  - <canvas> 是一个 HTML 元素，它本身只是一个位图图像的容器（一个矩形区域）。它自身没有绘图能力，所有的绘制工作必须在 JavaScript 内部完成
* 位图 vs 矢量：
  - Canvas 绘制的是位图（由像素点构成）。这意味着放大图形会失真（变模糊），这与 SVG（可缩放矢量图形）是不同的，SVG 是矢量图，放大不会失真。
* 主要用途：
  - 游戏开发（2D/2.5D 游戏）
  - 数据可视化（图表、报表）
  - Banner 广告
  - 图片编辑与合成
  - 实时视频处理与滤镜

## 基本使用步骤
1. 在 HTML 中创建 Canvas 元素
  - 设置 width 和 height 属性来定义画布大小（强烈推荐在属性中设置，而不是用 CSS）。用 CSS 设置大小会导致画布内容被拉伸，而不是真正改变其分辨率。
  ```html
    <canvas id="myCanvas" width="800" height="600">
        您的浏览器不支持 Canvas，请升级！
    </canvas>
    <!-- 中间的文字是降级方案，在不支持的浏览器中显示 -->
  ```
2. 在 JavaScript 中获取上下文（Context）
  - Canvas 的所有绘图 API 都通过这个“上下文”对象来调用。
  ```js
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d'); // '2d' 获取2D绘图上下文，目前还有 'webgl' 用于3D
  ```

## 核心绘图 API（2D 上下文）
* 绘制矩形
  - ctx.fillRect(x, y, width, height)：绘制一个填充的矩形。
  - ctx.strokeRect(x, y, width, height)：绘制一个矩形的边框。
  - ctx.clearRect(x, y, width, height)：清除指定矩形区域，使其变为完全透明。

  ```js
    ctx.fillStyle = 'blue';      // 设置填充颜色
    ctx.fillRect(50, 50, 200, 100); // 在 (50,50) 位置画一个 200x100 的蓝色矩形

    ctx.strokeStyle = 'red';     // 设置边框颜色
    ctx.lineWidth = 5;           // 设置边框宽度
    ctx.strokeRect(70, 70, 160, 80); // 画一个红色边框的矩形
  ```
* 绘制路径（Path）
  - 路径用于绘制复杂的形状（直线、曲线、多边形等）。路径绘图遵循一个固定的流程：
  1. 开始路径：ctx.beginPath()
  2. 移动笔触：ctx.moveTo(x, y)（将笔触移动到指定点，不画线）
  3. 绘制子路径：
    - 画直线：ctx.lineTo(x, y)
    - 画弧/圆：ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise) 或 ctx.arcTo()
    - 画二次贝塞尔曲线：ctx.quadraticCurveTo(cp1x, cp1y, x, y)
    - 画三次贝塞尔曲线：ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    - 画矩形路径：ctx.rect(x, y, width, height)
  4. 闭合路径（可选）：ctx.closePath()（将路径的起点和终点连接起来）
  5. 渲染路径：描边：ctx.stroke()、填充：ctx.fill()
  ```js
    // 画一个三角形
    ctx.beginPath();
    ctx.moveTo(100, 100); // 起点
    ctx.lineTo(150, 50);  // 第二点
    ctx.lineTo(200, 100); // 第三点
    ctx.closePath();      // 自动连接回起点 (100,100)
    ctx.strokeStyle = 'green';
    ctx.stroke();

    // 画一个圆
    ctx.beginPath();
    ctx.arc(300, 300, 50, 0, Math.PI * 2, false); // 圆心(300,300)，半径50，0到360度
    ctx.fillStyle = 'orange';
    ctx.fill();
  ```
* 样式与颜色
  - ctx.fillStyle：设置填充的颜色、渐变或图案。
  - ctx.strokeStyle：设置描边的颜色、渐变或图案。
  - ctx.lineWidth：设置线条宽度。
  - ctx.lineCap：设置线条末端样式（butt, round, square）。
  - ctx.lineJoin：设置线条相交的拐角样式（miter, round, bevel）。
  + 渐变：
    - ctx.createLinearGradient(x0, y0, x1, y1)：创建线性渐变。
    - ctx.createRadialGradient(x0, y0, r0, x1, y1, r1)：创建径向渐变。
    - 使用 gradient.addColorStop(position, color) 方法添加色标。
    ```js
        // 创建线性渐变
        const gradient = ctx.createLinearGradient(0, 0, 200, 0);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(0.5, 'white');
        gradient.addColorStop(1, 'blue');

        ctx.fillStyle = gradient;
        ctx.fillRect(10, 10, 200, 100);
    ```
* 绘制文本
  - ctx.fillText(text, x, y)：绘制填充文本。
  - ctx.strokeText(text, x, y)：绘制文本轮廓。
  - ctx.font：设置字体样式（用法同 CSS font 属性）。
  - ctx.textAlign：设置文本对齐方式（start, end, left, right, center）。
  - ctx.textBaseline：设置文本基线（top, hanging, middle, alphabetic, ideographic, bottom）。
  ```js
    ctx.font = '48px serif';
    ctx.fillText('Hello Canvas', 50, 100);
  ```
* 绘制图像
  - ctx.drawImage(image, dx, dy)
  - ctx.drawImage(image, dx, dy, dWidth, dHeight)：缩放
  - ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)：切片并缩放
  ```js
    const img = new Image();
    img.src = 'path/to/image.jpg';
    img.onload = function() {
        // 必须等图片加载完成后再绘制
        ctx.drawImage(img, 50, 50, 200, 150);
    };
  ```
* 变换（Transformation）
  > Canvas 的变换会影响到之后绘制的所有内容。
  - ctx.translate(x, y)：移动原点。
  - ctx.rotate(angle)：旋转。
  - ctx.scale(x, y)：缩放。
  - ctx.transform(a, b, c, d, e, f) / ctx.setTransform(a, b, c, d, e, f)：直接设置变换矩阵。

  - 经常与 ctx.save() 和 ctx.restore() 配对使用。save() 将当前状态（样式、变换等）压入栈中，restore() 弹出上一次保存的状态。
  ```js
    ctx.save(); // 保存默认状态

    ctx.translate(200, 200); // 将原点移动到画布中心
    ctx.rotate(Math.PI / 4); // 旋转45度
    ctx.fillRect(-50, -50, 100, 100); // 在旋转后的坐标系中画矩形

    ctx.restore(); // 恢复默认状态（原点、旋转都还原了）
  ```

## 高级主题与动画
* 动画实现原理:电影一样：逐帧绘制并快速连续擦除重绘。
  1. 清除画布：使用 clearRect(0, 0, width, height) 清除上一帧。
  2. 保存状态：（可选）使用 save()。
  3. 绘制图形：根据新的数据（如位置、角度）绘制当前帧。
  4. 恢复状态：（可选）使用 restore()。
  5. 循环：使用 requestAnimationFrame(callback) 请求下一帧，形成循环。
  ```js
    let x = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 1. 清除画布
        ctx.fillRect(x, 50, 50, 50); // 2. 绘制图形
        x += 2; // 更新位置
        if (x > canvas.width) x = 0; // 边界检测
        requestAnimationFrame(animate); // 3. 循环
    }
    animate();
  ```
* 性能优化
  - 分层 Canvas：将变化频繁和不频繁的元素画在不同的 Canvas 上叠加起来，避免重复绘制静态部分
  - 避免浮点数坐标：使用 Math.floor() 或 Math.ceil() 取整，可以减少浏览器抗锯齿的计算量。
  - 离屏渲染：对于需要重复绘制的复杂图形，可以先在一个不可见的（离屏）Canvas 上画好，然后使用 drawImage 将其绘制到主画布上。这相当于缓存了绘制操作。
  - 减少不必要的 API 调用：例如，在循环外部设置不变的样式。
* 交互（鼠标/触摸事件）
  - Canvas 本身是一个 DOM 元素，可以监听鼠标和触摸事件（click, mousemove, mousedown 等）。但挑战在于：如何判断用户点击了画布上的哪个图形？
  + 常用解决方案：
    - 数学边界检测：对于简单的形状（圆、矩形），通过计算鼠标点与图形几何中心的距离或坐标范围来判断。
    - 使用专门的库：如 Paper.js, Fabric.js, Konva.js 等，它们内置了强大的事件系统，可以直接为画布上的图形添加事件监听。