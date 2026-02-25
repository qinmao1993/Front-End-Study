export default {
    // 服务器配置
    server: {
        port: 9000,
        host: "localhost",
        // ssl:{}
    },

    // 静态文件配置
    static: {
        root: "./public",
        index: ["index.html", "index.htm"],
    },

    // 安全配置
    security: {
        cors: {
            enabled: true,
            origins: ["*"],
            methods: ["GET", "HEAD", "OPTIONS"],
        },
        rateLimit: {
            enabled: false,
            windowMs: 15 * 60 * 1000, // resetTime 15分钟
            max: 100, // 每个IP限制请求数
        },
    },

    // 性能配置
    performance: {
        compression: {
            enabled: true,
            level: 6, // 0-9
            threshold: 1024, // 最小压缩大小
            brotli: false,
        },
        cache: {
            maxAge: 3600, // 1小时
            immutable: false,
            etag: true,
            lastModified: true,
        },
    },

    // 目录浏览配置
    directory: {
        enabled: true,
        icons: true,
        template: null, // 自定义模板路径
    },

    // 日志配置
    logging: {
        enabled: true,
        format: "combined", // combined, common, dev, short, tiny
        level: "info", // error, warn, info, debug
    },
};
