# webGPU
作为WebGL的继任者，WebGPU并非简单的API升级，而是重构了Web端与GPU交互的底层逻辑。它直接对接Vulkan、Metal、DirectX 12等现代图形API，摆脱了WebGL对OpenGL ES的依赖，实现了对GPU算力的高效调度

## 浏览器支持
* Chrome 113+：稳定支持
* Safari 17+：部分支持

## 核心优势
* 图形与计算一体化：
  - 原生支持计算着色器，不仅能完成复杂3D渲染，还可直接承载机器学习推理、流体动力学模拟等通用计算任务，打破了WebGL仅能处理图形渲染的局限。
* 低开销资源管理：
  - 通过显式管线配置、内存绑定与命令编码机制，减少了驱动层的冗余操作，在千级Draw Call的复杂场景中，帧率可达WebGL的6倍以上（WebGPU 123 FPS vs WebGL 21 FPS）。
* 多线程并行能力：
  - 支持在Web Worker中提交GPU指令，避免了主线程阻塞，从根本上解决了重负载场景下的页面卡顿问题。

## 核心架构与概念
1. 适配器与设备（Adapter & Device）
  ```js
    // 初始化流程
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();

    // 适配器：物理GPU的抽象
    // 设备：逻辑GPU上下文，核心操作对象
  ```
2. 命令编码器（CommandEncoder）
```js
    const commandEncoder = device.createCommandEncoder();
    const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);

    // 提交命令
    renderPass.end();
    const commandBuffer = commandEncoder.finish();
    device.queue.submit([commandBuffer]);
```
3. 管线（Pipelines）
  - 渲染管线（RenderPipeline）：处理图形渲染
  - 计算管线（ComputePipeline）：处理通用GPU计算
  ```js
    const pipeline = device.createRenderPipeline({
        vertex: {
            module: shaderModule,
            entryPoint: "vertex_main"
        },
        fragment: {
            module: shaderModule,
            entryPoint: "fragment_main",
            targets: [{ format: presentationFormat }]
        },
        primitive: {
            topology: "triangle-list"
        },
        layout: "auto"
    });
  ```
4. WGSL着色器语言
  ```rust
    // WGSL示例：简单顶点着色器
    struct VertexInput {
        @location(0) position: vec3<f32>,
        @location(1) color: vec3<f32>
    };

    struct VertexOutput {
        @builtin(position) position: vec4<f32>,
        @location(0) color: vec3<f32>
    };

    @vertex
    fn vertex_main(input: VertexInput) -> VertexOutput {
        var output: VertexOutput;
        output.position = vec4<f32>(input.position, 1.0);
        output.color = input.color;
        return output;
    }
  ```