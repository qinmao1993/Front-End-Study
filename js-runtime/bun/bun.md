# bun
Bun是一个新兴的JavaScript运行时，旨在成为 Node.js 的高性能替代品。它集成了运行时、包管理器、打包器和测试运行器等多种功能，其核心设计目标是提供更快的速度和更现代化的开发体验。

## 对比 nodejs 差异
* 核心引擎
  - bun JavaScriptCore (来自Safari/WebKit)
  - nodejs V8 (来自Chrome)
* 开发语言
  - bun zig
  - nodejs C++
* 定位
  - bun 一体化工具链，内置包管理、打包、测试
  - nodejs 专注于JavaScript运行时
* 性能亮点
  - bun 启动速度极快 (快4-20倍)，包安装快 (比npm快30倍)，HTTP服务器和文件操作性能优势明显
  - 性能成熟稳定，生态系统经过充分优化
* 内置功能
  - bun 原生支持运行.ts、.jsx文件；内置打包器、测试运行器、WebSocket客户端、SQLite/MySQL/Redis客户端等
  - nodejs 需依靠第三方生态（如webpack、Jest、各类数据库驱动）
* 兼容性
  - bun 高度兼容Node.js API和npm包，可运行大多数现有代码
  - nodejs 行业标准，拥有最庞大的模块生态。