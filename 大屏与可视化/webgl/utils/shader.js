/**
 * 创建 shader
 * @param {*} glCtx webgl 绘制上下文
 * @param {*} type shader 的类型
 * @param {*} source shader的程序源码
 * @returns
 */
export function createShader(glCtx, type, source) {
    // 1. 创建指定类型着色器对象
    const shader = glCtx.createShader(type);
    // 2. 将源码分配给着色器对象
    glCtx.shaderSource(shader, source);
    // 3. 编译顶点着色器程序
    glCtx.compileShader(shader);

    // 检测是否编译正常。
    const success = glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.error(glCtx.getShaderInfoLog(shader));
    glCtx.deleteShader(shader);
}

/**
 * 创建 shader 程序
 * @param {*} glCtx  webgl 绘制上下文
 * @param {*} vertexShader 顶点着色器
 * @param {*} fragmentShader 片段着色器
 * @returns
 */
export function createProgram(glCtx, vertexShader, fragmentShader) {
    const program = glCtx.createProgram();
    //  将顶点着色器挂载在着色器程序上。
    vertexShader && glCtx.attachShader(program, vertexShader);
    // 将片段着色器挂载在着色器程序上。
    fragmentShader && glCtx.attachShader(program, fragmentShader);

    // 链接着色器程序
    glCtx.linkProgram(program);
    const result = glCtx.getProgramParameter(program, glCtx.LINK_STATUS);
    if (result) {
        // console.log("着色器程序创建成功");
        // const uniformSetters = createUniformSetters(glCtx, program);
        // const attributeSetters = createAttributeSetters(glCtx, program);
        // return {
        //     program,
        //     uniformSetters,
        //     attributeSetters,
        // };

        return program
    }
    const errorLog = glCtx.getProgramInfoLog(program);
    glCtx.deleteProgram(program);
    throw errorLog;
}

function createAttributeSetter(gl, attributeIndex) {
    return function (bufferInfo) {
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.buffer);
        gl.enableVertexAttribArray(attributeIndex);
        gl.vertexAttribPointer(
            attributeIndex,
            bufferInfo.numsPerElement || bufferInfo.size,
            bufferInfo.type || gl.FLOAT,
            bufferInfo.normalize || false,
            bufferInfo.stride || 0,
            bufferInfo.offset || 0
        );
    };
}

function createAttributeSetters(gl, program) {
  let attributesCount = getVariableCounts(gl, program, gl.ACTIVE_ATTRIBUTES);
  let attributeSetter = {};
  for (let i = 0; i < attributesCount; i++) {
    let attributeInfo = gl.getActiveAttrib(program, i);
    let attributeIndex = gl.getAttribLocation(program, attributeInfo.name);
    attributeSetter[attributeInfo.name] = createAttributeSetter(
      gl,
      attributeIndex
    );
  }
  return attributeSetter;
}

function createUniformSetters(gl, program) {
  let uniformSetters = {};
  let uniformsCount = getVariableCounts(gl, program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < uniformsCount; i++) {
    let uniformInfo = gl.getActiveUniform(program, i);
    if (!uniformInfo) {
      break;
    }
    let name = uniformInfo.name;
    if (name.substr(-3) === '[0]') {
      name = name.substr(0, name.length - 3);
    }
    let setter = createUniformSetter(gl, program, uniformInfo);
    uniformSetters[name] = setter;
  }
  return uniformSetters;
}