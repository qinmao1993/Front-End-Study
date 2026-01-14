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
> CSS 渐变是一种创建平滑颜色过渡的强大工具，无需使用图像即可实现丰富的视觉效果
* 语法
  + 线性渐变 (linear-gradient)
    ```css
        /* 基本语法 */
         /* 方向：to top right 左下到右上 */
        background: linear-gradient([方向或角度], 颜色停止点1, 颜色停止点2, ...);

        /* 示例 */
        .element {
            background: linear-gradient(to right, #32c7fe, #ffffff);
            /* 指定每个颜色的位置 */
            background: linear-gradient(to right, 
                #32c7fe 0%, 
                #32c7fe 30%, 
                #ffffff 70%, 
                #ffffff 100%
            );
        }
    ```
  + 径向渐变 (radial-gradient)
    ```css
        /* 基本语法 */
        background: radial-gradient([形状] [大小] at [位置], 颜色停止点1, 颜色停止点2, ...);

        /* 示例 */
        .element {
            /* 默认居中 */
            background: radial-gradient(circle, #32c7fe, #ffffff);

            /* 指定位置 */
            background: radial-gradient(circle at 0% 50%, #32c7fe, #ffffff);     /* 左侧居中 */
            background: radial-gradient(circle at 100% 0%, #32c7fe, #ffffff);    /* 右上角 */
            background: radial-gradient(circle at 30px 30px, #32c7fe, #ffffff);  /* 像素定位 */
            
            /* 椭圆形（默认） */
            background: radial-gradient(ellipse, #32c7fe, #ffffff);

            /* 指定大小 */
            background: radial-gradient(50px 100px, #32c7fe, #ffffff);  /* 宽度 高度 */

        }
    ```

* 高级应用
  ```css
    /* 多个渐变层叠 */
    .advanced {
        background: 
        linear-gradient(45deg, rgba(255,0,0,0.2) 0%, transparent 50%),
        linear-gradient(135deg, rgba(0,255,0,0.2) 0%, transparent 50%),
        linear-gradient(225deg, rgba(0,0,255,0.2) 0%, transparent 50%),
        linear-gradient(315deg, rgba(255,255,0,0.2) 0%, transparent 50%),
        #ffffff;
    }

    /* 网格背景 */
    .grid-bg {
        background-image: 
            linear-gradient(rgba(50, 199, 254, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(50, 199, 254, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
    }

    /* 渐变边框 */
    .gradient-border-1 {
        background: linear-gradient(white, white) padding-box,
                    linear-gradient(45deg, #32c7fe, #ffffff) border-box;
        border: 4px solid transparent;
        border-radius: 8px;
    }
  ```

* 文字渐变
  ```css
    .text-gradient {
        /* 1. 设置渐变背景 */
        background: linear-gradient(to bottom, #32c7fe 0%, #ffffff 100%);
        
        /* 2. 裁剪背景到文字区域 */
        -webkit-background-clip: text;
        background-clip: text;
        
        /* 3. 文字颜色透明，让背景显示出来 */
        -webkit-text-fill-color: transparent;
        color: transparent;
        
        /* 可选的文字样式 */
        font-size: 48px;
        font-weight: bold;
    }
  ```
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
