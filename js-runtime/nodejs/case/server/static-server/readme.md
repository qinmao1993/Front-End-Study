# 静态资源服务

## 项目结构
```text
    static-server/
    ├── server.js             # 主服务器文件
    ├── config.js             # 配置文件
    ├── mime-types.js         # MIME类型定义
    ├── middleware/           # 中间件目录
    │   ├── security.js      # 安全中间件
    │   ├── compression.js   # 压缩中间件
    │   ├── cache.js         # 缓存中间件
    │   └── logger.js        # 日志中间件
    ├── utils/               # 工具函数
    │   ├── path-utils.js    # 路径处理
    │   ├── file-utils.js    # 文件处理
    │   └── headers-utils.js # 头部处理
    └── public/              # 静态文件目录（示例）
        ├── index.html
        ├── css/
        └── js/
```