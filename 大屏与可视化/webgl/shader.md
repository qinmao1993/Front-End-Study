# 着色器 (Shaders)

## 概念
  - GLSL (OpenGL Shading Language)，运行在显卡（GPU）上的简短程序。允许我们通过编程来控制 GPU 的渲染
  - 它们构成了WebGL渲染管线的核心，负责处理几何体和像素的最终呈现

* 特性
  - 内置向量/矩阵类型
  - 硬件级并行计算支持
  - 无指针、递归、文件IO等通用编程特性

## 着色器类型
  > WebGL主要使用两种着色器，通常成对出现，构成一个着色器程序
  + 顶点着色器
    - 主要任务是将顶点的原始模型坐标（attribute）转换到屏幕上的最终位置（gl_Position）
    - 核心任务：顶点变换
  + 片段着色器(也称为像素着色器)
    - 核心任务：计算片段颜色

## 基础类型
  + 单精度浮点数
    - float f = 1.0;
  + 整数  
    - int i = 10;
  + 布尔值	
    - bool b = true;
  + 2D纹理采样器	
    - uniform sampler2D tex;

## 复合类型
  + 向量（vec2/3/4）
    - 2/3/4维浮点向量
    - 例： vec3 v = vec3(1.0, 0.5, 0.0);
  + 矩阵（mat2/3/4）
    - mat4 m = mat4(1.0);
  + 整数向量 ivec##
    - ivec2 pixel = ivec2(10, 20);

  - 数学运算函数
  - 纹理采样函数

## 特殊操作
  ```glsl
    vec4 color = vec4(1.0);
    color.rgba = vec4(0.8, 0.2, 0.5, 1.0);  // 分量别名（rgba/xyzw/stpq）
    vec2 uv = color.st;                     // 取前两个分量

    vec3 a = vec3(1.0, 2.0, 3.0);
    vec3 b = a.zyx;                     // 分量交换 => (3.0, 2.0, 1.0)
  ```

## 存储限定符
  - attribute	顶点着色器	逐顶点数据（位置/法线/UV等）
  - uniform	    全局	   所有着色器实例共享的常量（矩阵/纹理）
  - varying	    顶点→片段	顶点到片段间的插值数据
  - const	    局部	   编译时常量
  ```glsl
    // 顶点着色器
    attribute vec3 aPosition; 
    varying vec2 vTexCoord;
    uniform mat4 uMVP;

    // 片段着色器
    varying vec2 vTexCoord;
    uniform sampler2D uTexture;
  ```

## 流程控制
  ```glsl
    // 分支语句
    if (distance > 100.0) {
        color = vec4(1.0, 0.0, 0.0, 1.0); // 红色
    } else {
        color = vec4(0.0, 1.0, 0.0, 1.0); // 绿色
    }
    // 循环语句
    for (int i = 0; i < 4; i++) {
        sum += texture2D(uTexture, uv + offsets[i]);
    }
  ```

## 内置函数
* 数学运算
   - sin()/cos()	三角函数
   - pow()/exp()	幂/指数函数
   - sqrt()/inversesqrt()	平方根/平方根倒数
* 几何计算
  - dot(a, b)	    向量点积
  - cross(a, b)	向量叉积
  - length(v)	    向量长度
  - normalize(v)	单位化向量

* 纹理采样
  ```glsl
    vec4 color = texture2D(uTexture, uv);      // 2D纹理采样
    vec4 cubeColor = textureCube(envMap, dir);  // 立方体贴图采样
  ```

## 预编译指令
  ```glsl
    #version 100  // WebGL必须声明版本（通常100或300 es）

    // 设置默认浮点精度（片段着色器必需声明精度，顶点着色器默认是高精度）
    precision mediump float; 

    // 包含外部代码
    #pragma include "noise.glsl"
  ```

## 内置属性
* gl_Position
    - 不同于我们的浏览器窗口坐标系。所以当我们赋予 gl_Position 位置信息的时候，需要对其进行转换才能正确显示
    - 顶点的裁剪坐标系坐标，包含 X, Y, Z，W 四个坐标分量，顶点着色器接收到这个坐标之后，对它进行透视除法，即将各个分量同时除以 W，转换成 NDC 坐标，NDC 坐标每个分量的取值范围都在【-1, 1】之间，GPU 获取这个属性值作为顶点的最终位置进行绘制

* gl_FragColor
    - 片段（像素）颜色，包含 R, G, B, A 四个颜色分量，且每个分量的取值范围在【0,1】之间，GPU 获取这个值作为像素的最终颜色进行着色
    - 不同于我们常规颜色的【0，255】取值范围，所以当我们给 gl_FragColor 赋值时，也需要对其进行转换，转换公式为： (R值/255，G值/255，B值/255，A值/1）。以红色举例，在CSS中，红色用 RGBA 形式表示是（255,0,0,1），那么转换成 GLSL 形式就是(255 / 255, 0 / 255, 0 / 255, 1 / 1)，转换后的值为（1.0, 0.0, 0.0, 1.0)

* gl_PointSize：
    - 绘制到屏幕的点的大小，需要注意的是，gl_PointSize 只有在绘制图元是点的时候才会生效。

## 顶点着色器示例
  ```glsl
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    uniform mat4 uMVP;
    varying vec2 vTexCoord;

    void main() {
        gl_Position = uMVP ## vec4(aPosition, 1.0);
        vTexCoord = aTexCoord; // 传递UV坐标
    }
  ```

## 片段着色器示例
  ```glsl
    precision mediump float;
    varying vec2 vTexCoord;
    uniform sampler2D uTexture;

    void main() {
        vec4 texColor = texture2D(uTexture, vTexCoord);
        gl_FragColor = texColor ## vec4(0.9, 1.0, 0.8, 1.0); // 带色调滤镜
    }
  ```

## 数据流
  - CPU (JavaScript) -> GPU (顶点着色器): 通过 attribute（缓冲区）和 uniform 传递
  - 顶点着色器 -> 片段着色器: 通过 varying 传递（值在光栅化时被插值）
  - 片段着色器 -> 屏幕: 通过 gl_FragColor 输出颜色

## 编写、编译、链接
  > 如何在 JS 中创建、编译着色器程序并链接使用?
  - 着色器源码本质是字符串，所以既可以把着色器源码存储在 JavaScript 变量里，也可以放在 script 标签里，甚至存储在数据库中并通过 ajax 请求获取
  - 第1步：定义着色器程序
  ```html
    <body>
        <!-- 顶点着色器源码 -->
        <script type="shader-source" id="vertexShader">
            void main(){
                // 声明顶点位置
                gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
                // 声明要绘制的点的大小。
                gl_PointSize = 10.0;
            }
        </script>
        <!-- 片段着色器源码 -->
        <script type="shader-source" id="fragmentShader">
            void main(){
                // 设置像素颜色为红色
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
            }
        </script>
        <canvas id="canvas"></canvas>
    </body>
  ```
  - 第2步：Js 程序获取着色器程序、编译、链接、调用
  ```js
    // 获取 Canvas 的 WebGL 渲染上下文，所有操作都通过它进行
    const canvas = document.querySelector('#canvas');
    const glCtx = canvas.getContext('webgl')
    
    // 获取顶点着色器源码
    const vertexShaderSource = document.querySelector('#vertexShader').innerHTML;
    // 1. 创建顶点着色器对象
    const vertexShader = glCtx.createShader(glCtx.VERTEX_SHADER);
    // 2. 将源码分配给顶点着色器对象
    glCtx.shaderSource(vertexShader, vertexShaderSource);
    // 3. 编译顶点着色器程序
    glCtx.compileShader(vertexShader);

    // 4. 创建着色器程序
    const program = glCtx.createProgram();
    // 5. 将顶点着色器挂载在着色器程序上。
    glCtx.attachShader(program, vertexShader); 
    // 6. 链接着色器程序
    glCtx.linkProgram(program);
    // 7. 使用刚创建好的着色器程序
    glCtx.useProgram(program);

    // 设置清空画布颜色为黑色。
    glCtx.clearColor(0.0, 0.0, 0.0, 1.0);
    // 用上一步设置的清空画布颜色清空画布。
    glCtx.clear(glCtx.COLOR_BUFFER_BIT);
    // 绘制点。 mode 图元类型，first，代表从第几个点开始绘制、count，代表绘制的点的数量
    // void drawArrays(mode, first, count);
    glCtx.drawArrays(glCtx.POINTS, 0, 1);

  ```

## 文件命名规范
  - 顶点着色器：.vert, .vs, .vsh
  - 片段着色器：.frag, .fs, .fsh
  - 通用着色器：.glsl
