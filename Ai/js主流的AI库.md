# 主流 JavaScript AI 库

## 机器学习与深度学习
* TensorFlow.js：Google 出品，最成熟和全面的库。支持在浏览器和 Node.js 中训练、微调和部署模型，可利用 GPU 加速，并提供 tfjs-vis 可视化训练过程。
* Transformers.js：Hugging Face 官方库，可在浏览器中直接运行 BERT、GPT、LLaMA 等数千种预训练模型，甚至包括大语言模型。
* Brain.js / Synaptic：轻量级纯 JS 库，无依赖、易上手，适合教育演示和简单神经网络任务，但不适合大规模训练。
* ML5.js：基于 TensorFlow.js 的高层封装，提供即用型模型，代码极其简洁，适合快速原型开发或艺术家项目。
* WebNN API：W3C 新标准，直接访问本地 CPU、GPU 等硬件加速神经网络，性能极致，但尚在草案阶段，需关注浏览器实现。

## 自然语言处理 (NLP)
* Natural / compromise：Natural 适用于 Node.js 的经典文本处理库；compromise 是轻量级浏览器语法解析库，支持快速分词和词性标注。
* @nlpjs/core：模块化聊天机器人框架，支持多语言、意图识别和槽位填充，功能强大但体积较大
* @isdk/nlp-jieba：结巴中文分词的 WebAssembly 版本，可在浏览器中高效进行中文分词、词性标注等。

## 计算机视觉 (CV)
* MediaPipe (via JS)：Google 的跨平台框架。官方 JavaScript 包已封装其在浏览器中的人脸检测、姿势估计等任务。
* Face-api.js：基于 TensorFlow.js 的人脸识别库，开箱即用，支持检测、特征点标记和识别，是浏览器端人脸识别常用方案。
* JS Camera Kit / JeelizFaceFilter：JS Camera Kit 专注虚拟试妆的 Web 视觉套件；JeelizFaceFilter 是专业的实时人脸跟踪与 AR 滤镜库。
* Zappar CV / Effet.js：Zappar CV 是专业增强现实（AR）和计算机视觉库；Effet.js 是基于 WASM 的轻量级生物特征处理框架。
* @paulinasource/face-capture-landmarks-lib：React 专用库，提供开箱即用的人脸捕获、地标检测 UI 组件。


## 语音与音频处理
* Web Speech API：浏览器原生接口，无需额外库，轻松实现实时语音转文字。
* Whisper (via node-whisper)：OpenAI 强大 Whisper 模型的 Node.js 绑定，可进行高精度转录
* Feo / react-speech-recognition：Feo 是现代化 TypeScript + React Hook 方案，支持连续监听和命令识别；后者是基础的 React 封装。
* Web-wake-word / React-audio-processor-kit：Web-wake-word 是唤醒词检测库；后者提供实时音频处理与音量可视化。

## 数据处理与数组
* Danfo.js：JS 版 Pandas，专为数据清洗和特征工程设计。
* Simple Data Analysis：JS 版高性能 TypeScript，用户友好，用于处理表格和地理空间数据

## 模型转换与推理
* ONNX Runtime Web：微软的开放标准。可以在浏览器中运行多种框架训练出的 ONNX 格式模型，实现跨框架模型部署。
* 生成式 AI (Generative AI)
  - LangChain.js：最流行的 LLM 应用编排框架，用于构建复杂的 RAG、Agent 等定制化的工作流
  - LlamaIndex.TS：专注于 RAG 场景的数据连接框架，擅长处理和索引大量私有数据供 LLM 查询。
  - Vercel AI SDK：Next.js 全家桶用户的利器，提供 React Hooks 和工具函数，可快速集成聊天、流式响应等 AI 交互功能。
  - AI.JSX / CopilotKit：AI.JSX 支持在 React 中构建动态、对话式 UI；CopilotKit 则是强大的应用内 AI 副驾框架。