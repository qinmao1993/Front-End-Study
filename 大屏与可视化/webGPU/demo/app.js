// WebGPU 交互演示主文件（带详细用法注释）
// 注意：需在支持 WebGPU 的浏览器中运行（Chrome/Edge 的最新版本或 Canary），并通过 http(s) 提供页面。

const logEl = document.getElementById('log');
const canvas = document.getElementById('gpuCanvas');
const requestDeviceBtn = document.getElementById('requestDevice');
const deviceInfoEl = document.getElementById('deviceInfo');
const exampleSelect = document.getElementById('exampleSelect');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const singleStepBtn = document.getElementById('singleStepBtn');
const extraControls = document.getElementById('extraControls');

let adapter = null;
let device = null;
let context = null;
let format = null;
let animationHandle = null;
let running = false;
let currentExample = null;

function log(...args){
  console.log(...args);
  logEl.textContent += args.map(a=>typeof a==='object'?JSON.stringify(a):String(a)).join(' ') + '\n';
  logEl.scrollTop = logEl.scrollHeight;
}

// 请求 GPU 适配器和设备（最基本的第一步）
async function requestDevice(){
  if (!('gpu' in navigator)){
    log('当前浏览器不支持 WebGPU。');
    deviceInfoEl.textContent = '不支持 WebGPU';
    return;
  }

  // 打印一些诊断信息，方便定位无法获取 adapter 的原因
  log('navigator.userAgent:', navigator.userAgent);
  log('页面 origin:', location.origin);

  try{
    // 首先尝试默认请求
    adapter = await navigator.gpu.requestAdapter();
  }catch(e){
    log('requestAdapter 抛出异常:', e);
    adapter = null;
  }

  // 如果返回 null，可以尝试带 powerPreference 的请求作为 fallback
  if(!adapter){
    try{
      log('初次 requestAdapter 返回 null，尝试使用 powerPreference: high-performance');
      adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
    }catch(e){
      log('带选项的 requestAdapter 抛出异常:', e);
      adapter = null;
    }
  }

  if(!adapter){
    // 常见原因与检查项：
    //  - 页面未在安全上下文（必须是 https 或者 localhost）
    //  - 浏览器未启用或不支持 WebGPU
    //  - GPU 驱动不支持或浏览器需要开启实验性标志（仅在开发/测试时）
    log('无法获取 adapter。常见原因：未在安全上下文（https/localhost），浏览器不支持，或 GPU 驱动/标志未启用。');
    deviceInfoEl.textContent = '无法获取 adapter：请使用支持 WebGPU 的浏览器并通过 https 或 localhost 打开页面。';
    return;
  }

  log('Adapter 获取成功', adapter);

  try{
    // 请求 device。可以在这里声明需要的扩展、特性和限制（如 timestamp-query 等）
    device = await adapter.requestDevice();
  }catch(e){
    log('requestDevice 抛出异常:', e);
    device = null;
  }

  if(!device){ log('无法获取 device'); deviceInfoEl.textContent='无 device'; return; }
  log('Device 获取成功', device);

  // 获取 canvas 上下文并配置
  context = canvas.getContext('webgpu');
  format = navigator.gpu.getPreferredCanvasFormat();
  try{ context.configure({ device, format, alphaMode: 'opaque' }); }catch(e){ log('context.configure 失败:', e); }

  deviceInfoEl.textContent = `Adapter: ${adapter.name} | Format: ${format}`;
}

// 基础三角形渲染示例（展示：顶点缓冲区、shader 模块、渲染通道与命令提交）
async function createTriangleExample(){
  // 顶点数据（位置 + 颜色）
  // 三角形三个顶点，每个顶点包含 position.xy 和 color.rgb
  const vertexData = new Float32Array([
    0.0, 0.5,  1,0,0,
   -0.5,-0.5,  0,1,0,
    0.5,-0.5,  0,0,1,
  ]);

  // GPUBuffer 的 usage 标志：VERTEX 表示用于顶点输入，COPY_DST 可用于往缓冲区 upload
  const vertexBuffer = device.createBuffer({
    size: vertexData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: false,
  });

  // 将数据上传到 GPU（通过 queue.writeBuffer，适用于较小的数据）
  device.queue.writeBuffer(vertexBuffer, 0, vertexData.buffer, vertexData.byteOffset, vertexData.byteLength);

  // 简单顶点/片元 shader（WGSL）
  const shaderCode = `
  struct VertexOut{
    @builtin(position) pos: vec4<f32>;
    @location(0) color: vec3<f32>;
  };

  @vertex
  fn vs(@location(0) position: vec2<f32>, @location(1) color: vec3<f32>) -> VertexOut {
    var out: VertexOut;
    out.pos = vec4<f32>(position, 0.0, 1.0);
    out.color = color;
    return out;
  }

  @fragment
  fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    return vec4<f32>(in.color, 1.0);
  }
  `;

  const shaderModule = device.createShaderModule({ code: shaderCode });

  // 渲染管线：声明顶点缓冲区格式、颜色目标格式等
  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: shaderModule,
      entryPoint: 'vs',
      buffers: [{
        arrayStride: 5 * 4, // 每顶点 5 个 float（2 position + 3 color）
        attributes: [
          { shaderLocation: 0, offset: 0, format: 'float32x2' },
          { shaderLocation: 1, offset: 2 * 4, format: 'float32x3' },
        ],
      }],
    },
    fragment: {
      module: shaderModule,
      entryPoint: 'fs',
      targets: [{ format }],
    },
    primitive: { topology: 'triangle-list' },
  });

  function frame(){
    // 开始命令编码器，创建渲染通道，绘制并提交
    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();
    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: textureView,
        clearValue: { r: 0.1, g: 0.12, b: 0.15, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      }],
    });

    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.draw(3, 1, 0, 0);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
  }

  return { frame };
}

// 纹理渲染示例：展示如何从 ImageBitmap 上传纹理、创建 sampler、bind group
async function createTextureExample(){
  // 创建一个简单的纹理着色器，渲染一个带纹理的矩形
  const shaderCode = `
  @group(0) @binding(0) var mySampler: sampler;
  @group(0) @binding(1) var myTexture: texture_2d<f32>;

  struct VertexOut{
    @builtin(position) pos: vec4<f32>;
    @location(0) uv: vec2<f32>;
  };

  @vertex
  fn vs(@location(0) pos: vec2<f32>, @location(1) uv: vec2<f32>) -> VertexOut {
    var out: VertexOut;
    out.pos = vec4<f32>(pos, 0.0, 1.0);
    out.uv = uv;
    return out;
  }

  @fragment
  fn fs(in: VertexOut) -> @location(0) vec4<f32> {
    return textureSample(myTexture, mySampler, in.uv);
  }
  `;

  const shaderModule = device.createShaderModule({ code: shaderCode });

  // 顶点：两个三角形组成矩形，包含 uv
  const vertexData = new Float32Array([
    -1, -1,  0,1,
     1, -1,  1,1,
    -1,  1,  0,0,
    -1,  1,  0,0,
     1, -1,  1,1,
     1,  1,  1,0,
  ]);

  const vertexBuffer = device.createBuffer({ size: vertexData.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST });
  device.queue.writeBuffer(vertexBuffer, 0, vertexData.buffer, vertexData.byteOffset, vertexData.byteLength);

  // 默认纹理（1x1 white），用户可上传图片
  let gpuTexture = device.createTexture({ size: [1,1,1], format: 'rgba8unorm', usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT });
  device.queue.writeTexture({ texture: gpuTexture }, new Uint8Array([255,255,255,255]), { bytesPerRow: 4 }, [1,1,1]);

  const sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear' });

  const bindGroupLayout = device.createBindGroupLayout({ entries: [
    { binding:0, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
    { binding:1, visibility: GPUShaderStage.FRAGMENT, texture: {} },
  ]});

  const pipeline = device.createRenderPipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
    vertex: { module: shaderModule, entryPoint: 'vs', buffers: [{ arrayStride: 4*4, attributes: [ {shaderLocation:0, offset:0, format:'float32x2'}, {shaderLocation:1, offset:2*4, format:'float32x2'} ] }] },
    fragment: { module: shaderModule, entryPoint: 'fs', targets: [{ format }] },
    primitive: { topology: 'triangle-list' }
  });

  let bindGroup = device.createBindGroup({ layout: bindGroupLayout, entries: [ {binding:0, resource: sampler}, {binding:1, resource: gpuTexture.createView()} ] });

  // 上传图片到纹理（通过 <input type=file> 或 fetch）
  async function uploadImage(bitmap){
    // 将 ImageBitmap 的像素数据复制到 GPU 纹理。使用 copyExternalImageToTexture 是最直接的方法
    device.queue.copyExternalImageToTexture({ source: bitmap }, { texture: gpuTexture }, [bitmap.width, bitmap.height]);
    // 重新创建 bindGroup 以使用新的 texture view
    bindGroup = device.createBindGroup({ layout: bindGroupLayout, entries: [ {binding:0, resource: sampler}, {binding:1, resource: gpuTexture.createView()} ] });
  }

  // UI：添加上传按钮
  const fileInput = document.createElement('input'); fileInput.type='file'; fileInput.accept='image/*';
  fileInput.onchange = async (e) => {
    const f = e.target.files[0];
    if(!f) return;
    const img = await createImageBitmap(f);
    // 注意：canvas 必须确保与图片大小或缩放匹配
    gpuTexture = device.createTexture({ size: [img.width, img.height, 1], format: 'rgba8unorm', usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT });
    device.queue.copyExternalImageToTexture({ source: img }, { texture: gpuTexture }, [img.width, img.height]);
    bindGroup = device.createBindGroup({ layout: bindGroupLayout, entries: [ {binding:0, resource: sampler}, {binding:1, resource: gpuTexture.createView()} ] });
  };

  extraControls.appendChild(fileInput);

  function frame(){
    const encoder = device.createCommandEncoder();
    const view = context.getCurrentTexture().createView();
    const pass = encoder.beginRenderPass({ colorAttachments:[{ view, clearValue:{r:0.2,g:0.2,b:0.25,a:1}, loadOp:'clear', storeOp:'store' }] });
    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.setBindGroup(0, bindGroup);
    pass.draw(6,1,0,0);
    pass.end();
    device.queue.submit([encoder.finish()]);
  }

  return { frame };
}

// 计算着色器示例：创建一个位置缓冲并由 compute shader 更新，然后渲染点
async function createComputeExample(){
  // 粒子数量
  const N = 1024;
  // 初始位置随机化
  const positions = new Float32Array(N*2);
  for(let i=0;i<N;i++){ positions[i*2]= (Math.random()*2-1)*0.5; positions[i*2+1]=(Math.random()*2-1)*0.5; }

  // 创建 GPUBuffer： STORAGE 用于 compute shader 读写，VERTEX 用于渲染读取，COPY_DST/READ 供上传/读回
  const storageBuffer = device.createBuffer({ size: positions.byteLength, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC });
  device.queue.writeBuffer(storageBuffer, 0, positions.buffer, positions.byteOffset, positions.byteLength);

  // compute shader（WGSL）: 每个线程更新一个位置（演示简单速度场）
  const computeCode = `
  @group(0) @binding(0) var<storage, read_write> pos: array<vec2<f32>>;
  @compute @workgroup_size(64)
  fn cs(@builtin(global_invocation_id) gid: vec3<u32>){
    let i = gid.x;
    if(i >= arrayLength(&pos)) { return; }
    var p = pos[i];
    // 简单范例：周期性运动
    let t = f32(i) * 0.0001 + 0.01;
    p.x = p.x + 0.002 * sin(t + p.y*10.0);
    p.y = p.y + 0.002 * cos(t + p.x*10.0);
    pos[i] = p;
  }
  `;

  // 注意：WGSL 不支持 arrayLength(&pos) 通用做法是传入 count 或使用 workgroup size 避免越界
  const correctedComputeCode = `
  struct Pos { x: vec2<f32>; };
  @group(0) @binding(0) var<storage, read_write> pos: array<vec2<f32>>;
  @group(0) @binding(1) var<uniform> uCount: vec2<u32>; // low word为count
  @compute @workgroup_size(64)
  fn cs(@builtin(global_invocation_id) gid: vec3<u32>){
    let i = gid.x;
    if(i >= uCount.x) { return; }
    var p = pos[i];
    let t = f32(i) * 0.0003 + 0.01;
    p.x = p.x + 0.002 * sin(t + p.y*10.0);
    p.y = p.y + 0.002 * cos(t + p.x*10.0);
    pos[i] = p;
  }
  `;

  const computeModule = device.createShaderModule({ code: correctedComputeCode });

  // uniform buffer 保存粒子数量
  const uniformBuffer = device.createBuffer({ size: 8, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  const u32Count = new Uint32Array([N,0]);
  device.queue.writeBuffer(uniformBuffer, 0, u32Count.buffer);

  const computeBindGroupLayout = device.createBindGroupLayout({ entries:[ {binding:0, visibility:GPUShaderStage.COMPUTE, buffer:{ type:'read-write' } }, {binding:1, visibility:GPUShaderStage.COMPUTE, buffer:{ type:'uniform' } } ] });

  const computePipeline = device.createComputePipeline({ layout: device.createPipelineLayout({ bindGroupLayouts: [computeBindGroupLayout] }), compute:{ module: computeModule, entryPoint: 'cs' } });

  const computeBindGroup = device.createBindGroup({ layout: computeBindGroupLayout, entries:[ {binding:0, resource:{ buffer: storageBuffer } }, {binding:1, resource:{ buffer: uniformBuffer } } ] });

  // 渲染 pipeline：把 storageBuffer 当作顶点缓冲（vec2<f32>）并绘制点
  const vs_fs_code = `
  struct VertexOut{ @builtin(position) pos: vec4<f32>; @location(0) color: vec3<f32>; };
  @vertex
  fn vs(@location(0) position: vec2<f32>) -> VertexOut {
    var o: VertexOut; o.pos = vec4<f32>(position, 0.0, 1.0); o.color = vec3<f32>(0.9,0.6,0.2); return o;
  }
  @fragment
  fn fs(in: VertexOut) -> @location(0) vec4<f32> { return vec4<f32>(in.color, 1.0); }
  `;
  const renderModule = device.createShaderModule({ code: vs_fs_code });

  const pipeline = device.createRenderPipeline({ layout: 'auto', vertex:{ module: renderModule, entryPoint:'vs', buffers:[{ arrayStride: 2*4, attributes:[{shaderLocation:0, offset:0, format:'float32x2'}] }] }, fragment:{ module: renderModule, entryPoint:'fs', targets:[{ format }] }, primitive:{ topology:'point-list' } });

  async function frame(){
    // dispatch compute
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(computePipeline);
    pass.setBindGroup(0, computeBindGroup);
    pass.dispatchWorkgroups(Math.ceil(N/64));
    pass.end();

    // render pass
    const view = context.getCurrentTexture().createView();
    const rpass = encoder.beginRenderPass({ colorAttachments:[{ view, clearValue:{r:0.02,g:0.03,b:0.05,a:1}, loadOp:'clear', storeOp:'store' }] });
    rpass.setPipeline(pipeline);
    rpass.setVertexBuffer(0, storageBuffer);
    rpass.draw(N, 1, 0, 0);
    rpass.end();

    device.queue.submit([encoder.finish()]);
  }

  // 提供读回当前 GPUBuffer 内容的函数（示范 mapAsync）
  async function readBackPositions(){
    // 需要创建 COPY_SRC 的副本到 MAP_READ 缓冲区
    const readBuffer = device.createBuffer({ size: positions.byteLength, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
    const encoder = device.createCommandEncoder();
    encoder.copyBufferToBuffer(storageBuffer, 0, readBuffer, 0, positions.byteLength);
    device.queue.submit([encoder.finish()]);

    await readBuffer.mapAsync(GPUMapMode.READ);
    const copyArray = new Float32Array(readBuffer.getMappedRange().slice());
    readBuffer.unmap();
    return copyArray;
  }

  // 为演示向 UI 添加按钮
  const dumpBtn = document.createElement('button'); dumpBtn.textContent='读回粒子';
  dumpBtn.onclick = async ()=>{ const arr = await readBackPositions(); log('读回前几个：', arr.slice(0,8)); };
  extraControls.appendChild(dumpBtn);

  return { frame };
}

// 读回缓冲区示例独立展示 (mapAsync 用法演示)
async function createReadbackExample(){
  const arr = new Float32Array([1,2,3,4,5,6,7,8]);
  const buf = device.createBuffer({ size: arr.byteLength, usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ | GPUBufferUsage.VERTEX });
  device.queue.writeBuffer(buf, 0, arr.buffer);

  async function doRead(){
    // 直接 mapAsync 读取（注意：某些实现限制直接读取 COPY_SRC）
    await buf.mapAsync(GPUMapMode.READ);
    const copy = new Float32Array(buf.getMappedRange().slice());
    buf.unmap();
    log('读到数据:', copy);
  }

  return { frame: doRead };
}

// 用于根据选择创建当前示例的工厂
async function createExample(name){
  extraControls.innerHTML='';
  if(!device) { log('请先请求设备'); return null; }
  if(name==='triangle') return await createTriangleExample();
  if(name==='texture') return await createTextureExample();
  if(name==='compute') return await createComputeExample();
  if(name==='readback') return await createReadbackExample();
  return null;
}

// UI 事件
requestDeviceBtn.onclick = async ()=>{ await requestDevice(); };
startBtn.onclick = async ()=>{
  if(!device){ log('请先请求设备'); return; }
  if(running) return;
  currentExample = await createExample(exampleSelect.value);
  if(!currentExample){ log('无法创建示例'); return; }
  running = true;
  function loop(){ if(!running) return; if(currentExample.frame) currentExample.frame(); animationHandle = requestAnimationFrame(loop); }
  loop();
};
stopBtn.onclick = ()=>{ running=false; if(animationHandle) cancelAnimationFrame(animationHandle); };
singleStepBtn.onclick = async ()=>{ if(!device){ log('请先请求设备'); return; } currentExample = currentExample || await createExample(exampleSelect.value); if(currentExample && currentExample.frame) await currentExample.frame(); };

// 处理画布大小变化以适配像素比
function resizeCanvasToDisplaySize(canvas){
  const dpr = window.devicePixelRatio || 1;
  const width = Math.floor(canvas.clientWidth * dpr);
  const height = Math.floor(canvas.clientHeight * dpr);
  if (canvas.width !== width || canvas.height !== height){
    canvas.width = width; canvas.height = height; return true;
  }
  return false;
}

// 在每次帧提交前尝试调整 context 配置（部分实现需要手动处理尺寸）
function ensureCanvasConfigured(){
  if(!context || !device) return;
  const resized = resizeCanvasToDisplaySize(canvas);
  if(resized){
    context.configure({ device, format, alphaMode:'opaque' });
  }
}

// 窗口调整事件
window.addEventListener('resize', ()=>{ ensureCanvasConfigured(); });

// 初始日志
log('页面就绪。请点击 请求设备。');

// 方便在控制台直接访问
window._webgpu = { requestDevice, createExample };
