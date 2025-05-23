# svg 的使用
## why use
1. SVG 图形是使用数学公式创建的，需要在源文件中存储的数据要少得多，因为您无需存储每个独立像素的数据。
2. 矢量图形可更好地缩放。对于网络上的图像，尝试从原始大小放大图像可能产生失真（或像素化的）图像。原始像素数据是针对特定大小进行设计的。当图像不再是该大小时，显示图像的程序会猜测使用何种数据来填充新的像素。矢量图像具有更高的弹性；当图像大小变化时，数据公式可相应地调整。
3. 源文件大小可能更小，所以 SVG 图形比其他光栅图形的加载速度更快，使用的带宽更少。
4. SVG 图像由浏览器渲染，可以以编程方式绘制。SVG 图像可动态地更改，这使它们尤其适合数据驱动的应用程序，比如图表。
5. SVG 图像的源文件是一个文本文件，所以它既具有易于访问和搜索引擎友好特征。
## SVG Sprite
    SVG Sprite 使用 <symbol> 标签来定义一个图形模板对象，好处在于其可以重复利用

    symbol元素用来定义一个图形模板对象，它可以用一个元素实例化。symbol元素对图形的作用是在同一文档中多次使用，添加结构和语义。结构丰富的文档可以更生动地呈现出来，类似讲演稿或盲文，从而提升了可访问性。注意，一个symbol元素本身是不呈现的。只有symbol元素的实例（亦即，一个引用了symbol的 元素）才能呈现。

    <symbol> 定义的图形并不会第一时间显示出来，只有使用了 <use> 标签进行实例化以后才会显现

    use元素在SVG文档内取得目标节点，并在别的地方复制它们。
    它的效果等同于这些节点被深克隆到一个不可见的DOM中，然后将其粘贴到use元素的位置，很像HTML5中的克隆模板元素。


    要使用 <use> 来实例化一个 svg图形模板对象，则要使用其中的 xlink:href 属性，在我们处理好的 <symbol> 上都会带有一个 id

    ```html
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position:absolute;width:0;height:0;visibility:hidden">  
        <defs>
            <symbol id="icon1">...</symbol>
            <symbol id="icon2">...</symbol>
            <symbol id="icon3">...</symbol>
        </defs>
        </svg>  
    
    <!-- 根据每一个 <symbol> 的 id，我们可以使用 <use> 根据这些 id 来使用 svg，如下所示： -->

    <div class="icons">  
        <svg><use xlink:href="#icon1"/></svg>
        <svg><use xlink:href="#icon2"/></svg>
        <svg><use xlink:href="#icon3"/></svg>
    </div>  
```
SVG Sprite 的基本原理就是运用这些元素，相比较 CSS Sprite，SVG Sprite 显得更为友好，不用多余的例如 background-position 属性来控制位置。


结合webpack 的使用
配置文件中使用了 svg-sprite-loader 和 svgo-loader 对 svg 文件进行处理，svg-sprite-loader 的作用就是将多个 svg 文件合并为一个 <svg> 元素。至于 svgo-loader，作用是将 <svg> 中一些无用的信息过滤去除，精简结构，详细配置可以自行查阅对应的文档说明，可以根据实际需求进行过滤。

[参考](https://fe.ele.me/svg-sprite-jian-jie/) 