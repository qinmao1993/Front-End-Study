# gsap
GSAP是一个功能强大、性能卓越且与框架无关的动画引擎，能帮助你精确地控制网页中的任何元素，实现从简单到复杂的各种动画效果。

## 安装
  ```bash
  npm install gsap

  ```
  ```html
    <!-- 通过 CDN 引入 -->
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/gsap.min.js"></script>
  ```

## 核心概念：Tween
* Tween (补间动画)：这是GSAP最基本、最核心的动画单元，指的是从一个状态到另一个状态的平滑过渡。GSAP的核心是一个高速的属性操纵器，能以极高的精度随时间更新数值。它主要通过三个方法来创建补间动画：
  - gsap.to()：从元素的当前属性值，过渡到你指定的目标值。
  - gsap.from()：从你指定的起始值，过渡到元素的当前属性值。
  - gsap.fromTo()：允许你同时定义起始值和结束值，提供最精确的控制。

## 核心概念：Timeline(时间轴)
> 如果说Tween是单个动画，那么Timeline就是用来组织和编排一系列动画的强大容器。它允许你精确地控制多个动画的顺序、时间点和重叠方式，并将它们作为一个整体来操控（如暂停、恢复、反转等）。
  ```js
    // 创建一个时间轴实例
    let tl = gsap.timeline();

    // 使用时间轴编排动画
    tl.to(".box", { duration: 1, x: 100, ease: "back.out" }) // 第一个动画
    .from(".circle", { duration: 0.5, scale: 0, ease: "bounce.out" }, "-=0.5"); // 第二个动画，比第一个提前0.5秒开始
  ```
  
## 插件生态
> GSAP的功能通过丰富的插件得以极大扩展
* ScrollTrigger：使用最广泛的插件，让你可以用极简的代码创建出令人惊叹的滚动触发动画。
* MorphSVG：将一个SVG形状平滑地变形为另一个，非常适合图标转换等场景。
* DrawSVG：以绘画的形式逐渐显示SVG的路径线条。
* MotionPathPlugin：让元素沿着指定的SVG路径运动。
* Flip：轻松实现元素状态改变的流畅动画。
* SplitText：将文本拆分为单词、字符或行，以便进行精细的逐字动画。
* Observer：标准化不同浏览器和设备上的事件监听。
* ScrollSmoother：创建平滑的滚动效果。