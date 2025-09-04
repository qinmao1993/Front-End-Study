# svg 的使用

## 是什么
* SVG 的全称是 Scalable Vector Graphics，中文意为“可缩放矢量图形”。它是一种基于 XML 语法的、用于描述二维矢量图形的开放标准文件格式和 Web 技术。
* 核心
  - 矢量（Vector）：与常见的位图（如 JPEG, PNG, GIF）不同，矢量图形不是由像素点组成的。它使用数学公式来定义图形中的点、线、曲线、形状和颜色。这意味着图形由几何特性来描述，而不是固定的像素网格
  - 可缩放（Scalable）：由于是数学定义的，SVG 图像可以在任何缩放级别或任何尺寸下被渲染，而完全不会损失清晰度或出现像素化。无论是放在移动设备屏幕上还是投影到巨大的广告牌上，它都能保持锐利和清晰。

## 主要特点和优势
* 无限缩放而不失真：这是最核心的优势，尤其适用于图标、Logo、图表等需要适应不同屏幕分辨率的场景。
* 文件体积小：对于简单的图形（如图标、几何形状），SVG 文件通常比位图格式（如 PNG）小得多，有利于减少网络请求和提高页面加载速度。
* 可通过 CSS 和 JavaScript 进行控制：作为 DOM 的一部分，SVG 的样式（如颜色、描边、透明度）可以用 CSS 轻松修改，实现动态主题切换。其结构和属性也可以通过 JavaScript 进行操作，创建复杂的交互和动画。
* 可访问性和 SEO 友好：由于 SVG 内部的文本是真实文本（而非图片中的文字），屏幕阅读器可以读取，搜索引擎可以索引，这对可访问性和搜索引擎优化非常有利
* 设计控制精细：你可以精确控制图形的每一个部分，包括每个点的路径、每个元素的样式和层级关系

## SVG 的基本语法和结构
  ```xml
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <!-- 图形内容在这里绘制 -->
        <circle cx="100" cy="100" r="50" fill="red" />
    </svg>

  ```
* <svg>：根元素，定义了整个 SVG 画布。
  - xmlns：XML 命名空间，必须声明。
  - viewBox：它定义了 SVG 的“视野”和“坐标系”。它的值由四个数字组成：min-x, min-y, width, height。它建立了画布的纵横比和用户坐标系，是实现响应式的关键。
  - width 和 height：定义 SVG 在 HTML 中渲染的绝对尺寸（如 px, cm, in等）。如果只设置 viewBox 而不设置 width/height，SVG 会自适应容器大小。
* 常用图形元素
  + <circle>：圆形
    - cx, cy：圆心坐标
    - r：半径
    - fill：填充颜色
  + <rect>：矩形
    - x, y：左上角坐标
    - width, height：宽高
    - rx, ry：圆角半径
  + <line>：直线
    - x1, y1：起点坐标
    - x2, y2：终点坐标
    - stroke：线条颜色（因为线没有填充区域，所以用 stroke）
  + <polygon>：多边形（封闭的）
    - points：定义各个顶点的坐标，格式为 x1,y1 x2,y2 x3,y3 ...
  + <polyline>：折线（不封闭的）
    - points：同上
  + <path>：最强大、最复杂的元素，可以绘制任何形状。
    - d：包含一系列绘制命令（Moveto, Lineto, Curveto等）和坐标数据。
    - 命令例如：M 10 10 (移动到点 10,10)，L 50 50 (画一条线到点 50,50)，Z (闭合路径)。
  + <text>：文字
    - x, y：文字基线起点坐标
  + <g>：分组元素
    - 用于将多个元素组合在一起，可以对其应用变换（transform）和样式，方便统一管理。

## 如何在 Web 中使用 SVG
* 方式一：内联（Inline）：直接将 SVG 代码嵌入到 HTML 文件中
  - 优点：可以通过 CSS 和 JS 直接操作，交互性最好，性能最佳（减少 HTTP 请求）。
  ```html
    <!DOCTYPE html>
    <html>
    <body>
        <svg width="100" height="100">
            <circle cx="50" cy="50" r="40" fill="gold" />
        </svg>
    </body>
    </html>
  ```
* 方式二：作为图片源（<img> 标签）
  - 优点：使用简单，像普通图片一样。
  - 缺点：无法用页面中的 CSS 和 JS 操作 SVG 内部的样式和 DOM。
  ```html
    <img src="image.svg" alt="描述文字" width="200" height="200">
  ```
* 作为 CSS 背景图
  ```css
    .icon {
        background-image: url('image.svg');
        width: 50px;
        height: 50px;
    }
  ```
* 作为对象（<object> 标签）：
  ```html
   <object type="image/svg+xml" data="image.svg"></object>
  ```

## SVG 的样式、动画与交互
* 常用 CSS 属性
  - fill：设置填充颜色（相当于 background-color）。
  - fill-opacity：填充透明度。
  - stroke：设置描边（边框）颜色。
  - stroke-width：描边宽度。
  - stroke-opacity：描边透明度。
  - opacity：整个元素的透明度。
* 示例
  ```xml
    <rect class="my-rect" ... />
    <style>
        .my-rect {
            fill: blue;
            stroke: black;
            stroke-width: 3px;
            transition: fill 0.3s ease; /* 甚至可以有过渡动画 */
        }
        .my-rect:hover {
            fill: lightblue;
        }
    </style>
  ```

## SVG 的适用场景
* 图标（Icons）：矢量图标字体（如 Font Awesome）正逐渐被 SVG 图标取代，因为 SVG 更易控制、更易访问且多色支持更好。
* 数据可视化（Charts & Graphs）：D3.js 等顶级可视化库就是基于 SVG 的，可以创建复杂、交互式的图表。
* 交互式地图：地图由路径（<path>）组成，非常适合用 SVG 绘制，可以轻松实现高亮区域、显示提示信息等交互。
* Logo：需要在不同尺寸媒体上保持清晰。

## SVG Sprite
* SVG Sprite 使用 <symbol> 标签来定义一个图形模板对象，好处在于其可以重复利用
    - symbol 元素用来定义一个图形模板对象，它可以用一个元素实例化。symbol元素对图形的作用是在同一文档中多次使用，添加结构和语义。
    - <symbol> 定义的图形并不会第一时间显示出来，只有使用了 <use> 标签进行实例化以后才会显现。
    - use 元素在 SVG 文档内取得目标节点，并在别的地方复制它们。它的效果等同于这些节点被深克隆到一个不可见的DOM中，然后将其粘贴到use元素的位置，很像HTML5中的克隆模板元素。
    - 要使用 <use> 来实例化一个 svg 图形模板对象，则要使用其中的 xlink:href 属性，在我们处理好的 <symbol> 上都会带有一个 id
    ```html
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position:absolute;width:0;height:0;visibility:hidden">  
            <defs>
                <symbol id="icon1">...</symbol>
                <symbol id="icon2">...</symbol>
                <symbol id="icon3">...</symbol>
            </defs>
        </svg>  
    
        <div class="icons">  
            <svg><use xlink:href="#icon1"/></svg>
            <svg><use xlink:href="#icon2"/></svg>
            <svg><use xlink:href="#icon3"/></svg>
        </div>  
   ```