# flex 伸缩布局
## flex容器:
  - 给 div 这类块状元素元素设置 display:flex
  - 给 span 这类内联元素设置 display:inline-flex (flex子项 类似行内块的概念，自适应宽度)
  - 这些元素称为flex容器，里面的子元素称为flex子项。

## 作用在flex容器上:
* 布局方向与换行 
  + flex-direction
    - flex-direction: row(默认) | row-reverse | column | column-reverse;
    - 用来控制子项整体布局方向，是从左往右还是从右往左，是从上往下还是从下往
  + flex-wrap
    - flex-wrap: nowrap(默认值) | wrap | wrap-reverse;
    - 控制子项整体单行显示还是换行显示，如果换行，则下面一行是否反方向显示
  + flex-flow
    - flex-flow: <‘flex-direction’> || <‘flex-wrap’>
    - 上面两属性的缩写


* 子项对齐 
  + 水平方向：justify-content
    - justify-content: flex-start | flex-end | center | space-between |space-around | space-evenly;
    - around是环绕的意思，意思是每个flex子项两侧都环绕互不干扰的等宽的空白间距，最终视觉边缘两侧的空白只有中间空白宽度一半
    - evenly 是匀称、平等的意思。也就是视觉上，每个flex子项两侧空白间距完全相等
  + 垂直方向:align-items
    - align-items: stretch（默认值，子项拉伸） | flex-start | flex-end | center | baseline;
    - baseline 子项都相对于 flex 容器的基线对齐。

* align-content
    - align-content: stretch | flex-start | flex-end | center | space-between |space-around | space-evenly;
    - 与 justify-content 相似且对立的属性，指明垂直方向每一行 flex 元素的对齐和分布方式，flex子项只有一行，则 align-content 属性是没有任何效果

## 作用在flex子项上:
* flex-grow: <number>;  数值，可以是小数，默认值是 0 不能为负数
  - 表示该元素可以占据容器中剩余空间的比例，剩余空间总量是1
  - 有多个元素都设置了 flex-grow: 1，它们将平分剩余空间
* flex-shrink: <number>;  数值，默认值是 1 不支持负值
  - 容器空间不足时候，元素的收缩比例，多个元素都设置了 flex-shrink: 1，按比例收缩。
* flex-basis: <length> | auto; 默认值是 auto 
  - 分配剩余空间之前元素的默认大小
  - 值为 0% 表示该元素的初始大小为 0，所有空间都将由 flex-grow 属性来分配。

* flex: [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ] 默认值为 0 1 auto
  - flex:1 等同于 flex-grow:1;flex-shrink:1;flex-basis:0;

* align-self
  - align-self: auto | flex-start | flex-end | center | baseline | stretch;
  - 指控制单独某一个 flex 子项的垂直对齐方式
  - 继承自 flex 容器的 align-items 属性  
* order: <integer>; 整数值，默认值是 0 
  - order 改变某一个flex子项的排序位置
  - 某一个flex子项在最前面显示，可以设置比0小的整数，如-1就可以了

## 注意
* 在flex布局中，flex子元素的设置 float，clear 以及 vertical-align 属性无效
