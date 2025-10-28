# CSS3
## 选择器
* 属性：
  - E[attr=val]
  - E[attr]
  - E[attr^=val] 属性值以val开头
  - E[attr$=val] 属性值以val结尾
  - E[attr*m=val]属性值含有val,不管在什么位置
    
* 伪类：
    - E:first-child 选中父元素中的第一个E子元素
    - E:last-child  选中父元素中的最后一个E子元素
    - E:nth-child(n) 选中父元素中第n个子元素（n从0开始）n(数字，表达式 -5+n,2n+1,odd,even)
    - E:nth-last-child(n)  选中父元素中倒数第n个子元素（元素0开始，n从0开始）

    - E:empty 选中内容为空，或没有子元素
    - E:target    选中锚点的的目标元素
    - E:not(选择器)
    ```css
      /* 示例 */
     p:first-child   
     /* 先找父元素 找到所有的子元素  在去找第一个子元素  匹配是不是p  如果不是无效的选择器 */
     p:first-of-type 
     /* 先找父元素 找到所有的p元素  找第一个 */
     p:last-of-type 
     /* 最后一个 */
     p:nth-of-type()
     /* 第几个 */
     p:nth-last-of-type 
     /* 倒数第几个 */
    ```        

* 结构选择器：+ ~
  - E[attrxxxx]+E   选择当前的元素 然后找到相邻的下一个元素
  - E[attrxxxx]~E   选择当前的元素 然后后面所有的元素    
## 伪元素：
* ::before ::after   
* 选中
  - ::first-letter 选择首字母
  - ::first-line   第一行
  - ::selection    选中的区域  只能变color 和 background-color  
## 阴影
* text-shadow (文字阴影): 水平位移  垂直位移  模糊程度 颜色
   - 水平位移 值越大越往右 反之往左
   - 垂直位移 值越大越往下 反之往上
   - 模糊程度 值从0开始，越大越模糊
    
* box-shadow(盒子阴影):水平位移  垂直位移  模糊程度 扩展半径 颜色 内阴影（inset）
    - 扩展半径  可以为负值，值越大，扩展半径越大
    - 内阴影  inset(可选)
    - 一般用border 设置线比较粗，用box-shadow 的内阴影设置线比较细如下：
    - box-shadow: 0px -.5px 0px 0px #F5F4F3 inset;
## 边框
 * border-radius
    - border-radius:x x x x/y y y y
    - 正圆:border-radius:50%;

 * border-image
    - border-image-source:url();
    - 切割图片 border-image-slice:
    - border-image-repeat:round;
## 背景
* background-image(支持多张图)：
   - url("images/bg1.png") left top,
   - url("images/bg2.png") right top,
   - url("images/bg3.png") right bottom,
   - url("images/bg4.png") left bottom,
   - url("images/bg5.png") center center;

* background-size:
   - 数字/百分比，
   - cover 把背景图片放大到适合元素容器的尺寸，图片比例不变，但是要注意，超出容器的部分可能会裁掉。
   - contain 完全显示图片，不考虑是否覆盖整个元素
   + 注意：
        - background-size：100% 100%;---按容器比例撑满，图片变形；

* background-origin 
   - 背景原点(默认是padding-box)
* background-clip 背景图片的显示位置
  - background-clip: border-box|padding-box|content-box;
## 图片 
* 指定元素的内容应该如何去适应指定容器的高度与宽度
* object-fit: fill|contain|cover|scale-down|none|initial|inherit;
    - contain 保持原有尺寸比例。内容被缩放。
    - cover 保持原有尺寸比例。但部分内容可能被剪切。
    - none 保留原有元素内容的长度和宽度，也就是说内容不会被重置。
    - scale-down 保持原有尺寸比例。内容的尺寸与 none 或 contain 中的一个相同，取决于它们两个之间谁得到的对象尺寸会更小一些。
* 图片不失真设置
    ```css
    img{
        width:100%;
        height:100%;
        objece-fit:contain;
    }
    ```
## 渐变
 * linear-gradient(线性渐变)([ <angle> | to <side-or-corner> ,]? <color-stop> [, <color-stop>]+ )
            where <side-or-corner> = [left | right] || [top | bottom]
            and <color-stop>     = <color> [ <percentage> | <length> ]?

        ```css
            background-image:linear-gradient(45deg,#D1EE4D,#1ABF22,#F389B7);}
            /* 45度三色线性渐变，初始值为黄色，中间值为绿色，结束值为粉色。角度可以设置负数
            没有设置颜色的具体位置时，三个色块默认平均分布。*/

            background-image:linear-gradient(#F8F86D,#239C23 50%,#298C1E 51%,#D1E710)
            background-image:linear-gradient(to right,red,orange,yellow,green,cyan,blue,purple)
            background-image:linear-gradient(to bottom right,red,yellow)
            background-image:linear-gradient(to bottom left,#FC3,rgba(255,255,255,0))

            background:linear-gradient(to bottom left,#FC3,rgba(255,255,255,0)),url(images/1957.jpg)

            /* 不设置任何的角度和方位，则默认是从上往下。可以为某个颜色设置具体的位置，可以是百分比，或者是具体的像素*/
        ```

 * 径向渐变: background-image:radial-gradient(20px at 10px,red,green);
        
 * [参考](http://www.mrszhao.com/post/58.html)
## transform
* 2D转换:
    * 位移 translateX(),translateY(),translate(X,Y)
    * 旋转 rotate 值越大 是顺时针 反之则逆时针
    * 缩放 scale   值越大 放大 反之缩小
    * 倾斜 skewX skewY skew

* 3D转换：
    * translateZ() translate(X,Y,Z)
    * 视角：perspective
    * 3d转换：transform-style:flat 2d平面呈现 perserve-3d 3d空间呈现 
## css 动画
* 详见[浏览器动画](/浏览器/动画.md)
## media 
 ```css
 @media (min-width: 750px) {
    html {
        font-size: 100px;
    }
 }
 ```
## css变量
* 好处：
  - 减少样式代码的重复性
  - 增加样式代码的扩展性
  - 提高样式代码的灵活性
  - 增多一种CSS与JS的通讯方式
  - 不用深层遍历DOM改变某个样式
* 定义：
  ```css
  .page-wrap {
    // 活动规则-填充颜色
    --activityRuleFillColor: #ff6b5a;
  }
  .btn {
    background: var(--activityRuleFillColor); 
  ```
* 与js的交互
  ```js
    // getPropertyValue(): 读取变量
    this.$el.style.getPropertyValue('--global-color').trim();
   // 主题设置
    initThemeConfig({
        baseInfo,
    }) {
        const themeConfig = {
            buttonColour: baseInfo.shareInfoDTO.buttonColour,
            buttonWordColour: baseInfo.shareInfoDTO.buttonWordColour,
        };
        Object.entries(themeConfig).forEach(([key, value]) => {
            this.$el.style.setProperty(`--${key}`, value);
        });
    },
    // removeProperty(): 删除变量
  ```
## flex
[flex](./flex.md)
