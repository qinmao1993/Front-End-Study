# IntersectionObserver
检测元素进出视口，一次搞定懒加载 + 曝光埋点，性能零损耗。

## 是什么
  - 是一种现代浏览器提供的 API，用于检测元素是否进入或离开视口（viewport）。它可以用于实现懒加载、无限滚动、广告曝光统计等功能
  + 常用的配置选项包括：
    - root：指定用于检测可见性的根元素，默认为视口。
    - rootMargin：用于扩展或缩小根元素的边界，类似于 CSS 的 margin 属性。
    - threshold：指定触发回调的阈值，可以是单个值或数组，表示目标元素可见部分的比例

## 核心用法及示例
  ```html
  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>IntersectionObserver 示例</title>
        <style>
            .box {
                width: 100px;
                height: 100px;
                margin: 50px;
                background-color: lightblue;
            }
        </style>
    </head>
    <body>
        <div class="box" id="box1"></div>
        <div class="box" id="box2"></div>
        <div class="box" id="box3"></div>
        <script>
            document.addEventListener("DOMContentLoaded", function() {
                const boxes = document.querySelectorAll('.box');

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            console.log(`${entry.target.id} is in the viewport`);
                        } else {
                            console.log(`${entry.target.id} is out of the viewport`);
                        }
                    });
                },{
                    root: container,
                    rootMargin: '0px',
                    threshold: 0.5
                });

                boxes.forEach(box => {
                    observer.observe(box);
                });
            });
        </script>
    </body>
    </html>

  ```
