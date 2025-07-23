// 片段着色器
precision mediump float;  // 浮点数设置为中等精度
uniform vec4 u_Color; // 全局变量，用来接收 Js 传递过来的颜色。

void main() {
    // 将颜色处理成 GLSL 允许的范围[0， 1]。
    vec4 color = u_Color / vec4(255, 255, 255, 1); 
    // 点的最终颜色。
    gl_FragColor = color;
}