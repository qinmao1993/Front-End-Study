# webgl
## 产生的背景
以前实现web 3d 动画效果需要借助Adobe 的 Flash、微软的 SilverLight 等来实现。
后来出现了一种跨平台的 3D 开发标准，也就是 WebGL 规范。
## webgl 是什么
WebGL 是一组基于 JavaScript 语言的图形规范，为 Web 开发者提供一套3D图形相关的 API
## 工作原理
webgl 工作方式和流水线类似，经过一道道工序把3d 模型数据渲染到2d屏幕上 业界称为 渲染管线
## 前置知识
* html(canvas)
* js
* GLSL(OpenGL Shading Language  OpenGL 着色语言) 
    - 运行在显卡（GPU）上的简短程序，允许我们通过编程来控制 GPU 的渲染
* 3D数学知识