# c# 基本语法
C# 是由微软公司于 2000 年推出的一种现代、面向对象、类型安全的编程语言，运行在 .NET 平台（包括 .NET Framework、.NET Core 及最新的统一 .NET）之上。它由 Anders Hejlsberg（Delphi 和 Turbo Pascal 之父）主导设计，语法风格深受 C/C++ 和 Java 影响，同时又融入了函数式、异步编程等现代特性。

# 跨平台能力
* 自 .NET Core 起，C# 可原生运行于 Windows、Linux、macOS 以及移动、嵌入式设备。
* .NET 统一 (2020-)	.NET 5/6/8/9 合并 .NET Core 与 .NET Framework，成为唯一主流开发平台。

## 核心应用场景
* Windows 桌面应用开发 —— 传统根基
  - 技术栈：WinForms（轻量、快速开发）、WPF（Windows Presentation Foundation，基于 XAML，界面与逻辑分离，适合复杂、美观的企业级软件）、WinUI 3（微软最新的原生 UI 框架）。
  - 典型产品：企业 ERP 系统、工业上位机软件、设计工具（如 Microsoft Visual Studio 本身）、金融交易终端。
  - 优势：对 Windows API 的调用最为直接，控件生态成熟（如 DevExpress、Telerik），性能可控性极强。
* Web 应用与后端服务 —— 高性能互联网后端
  - RESTful API / 微服务：ASP.NET Core Web API 结合 Minimal API，性能在 TechEmpower 基准测试中长期名列前茅。
  - 服务端渲染：Blazor（允许使用 C# 替代 JavaScript 编写交互式 Web UI），包含 Blazor Server（SignalR 实时连接）和 Blazor WebAssembly（直接在浏览器运行 .NET 代码）。
  - 大型单体应用：ASP.NET Core MVC / Razor Pages。
* 移动端与跨平台客户端开发 —— 一份代码多端运行
  - 技术栈：.NET MAUI（Multi-platform App UI，.NET 6+ 时代的统一框架，前身为 Xamarin.Forms）。
  - 支持平台：iOS、Android、macOS、Windows。
  - 原理：通过平台抽象层调用各平台的原生控件和 API，而非使用 WebView 模拟（如 Electron），因此界面体验接近原生，性能优于混合开发方案。
  - 典型产品：Microsoft Azure 移动客户端、UPS 内部物流手持终端软件。
* 游戏开发 —— C# 的“杀手级”应用领域
  - 核心引擎：Unity（全球市场占有率最高的游戏引擎之一）。
  - C# 的角色：Unity 将 C# 作为首选脚本语言。开发者使用 C# 编写游戏逻辑（角色控制、AI、物理碰撞响应、UI 交互）。
  + 覆盖范围：
    - 移动游戏：王者荣耀（部分逻辑）、原神、炉石传说。
    - 独立游戏：空洞骑士、奥日与黑暗森林。
    - VR/AR 应用：工业仿真、医疗培训。
* 云原生与微服务 —— 企业数字化转型主力
  - 运行环境：容器化（Docker + Kubernetes）。.NET 提供极小的容器镜像（Alpine Linux 基础镜像仅约 10MB）。
  + 特色功能：
    - 内置的 gRPC 高性能服务支持。
    - Orleans 虚拟 Actor 模型（用于构建高并发分布式系统，如 Halo 游戏服务器）。
    - 与 Azure 深度集成（Azure Functions、App Service、Cosmos DB SDK）。
  - 典型应用：电商秒杀系统的订单服务、IoT 设备数据接入网关。
* 人工智能与机器学习 —— 模型落地与推理
  - 核心库：ML.NET（微软官方开源机器学习框架）、ONNX Runtime（开放神经网络交换格式运行时）。
  + 应用场景：
    - 模型集成：将 Python 训练的模型（PyTorch/TensorFlow）导出为 ONNX 格式，由 C# 程序调用进行高性能推理，这是工业级 AI 落地的常见模式（规避 Python 部署繁琐、性能波动问题）。
    - 本地 AI：结合 Semantic Kernel 开发 AI Agent 应用，或使用 Microsoft.Extensions.AI 抽象层对接各种大模型 API。
    - 典型案例：Windows 内置的 OCR 功能、工业视觉检测软件中的图像分类模块。
* 物联网与嵌入式系统 —— 低功耗设备编程
  - 技术栈：.NET nanoFramework、Meadow。
  - 能力：允许在资源受限的微控制器（MCU，如 ESP32、STM32）上运行 C# 代码，利用熟悉的 Visual Studio 调试工具开发嵌入式软件。
  - 优势：相比 C/C++，开发效率极高，内存安全自动管理，适合原型验证和复杂度较高的嵌入式应用（如带显示屏的智能家居中控）。