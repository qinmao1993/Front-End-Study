// 顶点着色器
// 接收 js 传递过来的点的坐标（X, Y）
attribute vec2 a_Position;

void main() {
    // 需要将 canvas 的坐标值 转换为 [-1.0, 1.0]的范围
    gl_Position = vec4(a_Position, 0.0, 1.0);
    gl_PointSize = 10.0;
}