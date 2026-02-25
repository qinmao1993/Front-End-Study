class SecurityMiddleware {
    constructor(config) {
        this.config = config;
        this.rateLimitStore = new Map();
    }

    /**
     * CORS 中间件
     */
    cors(req, res) {
        const corsConfig = this.config.security.cors;

        if (!corsConfig.enabled) return;

        // 设置 CORS 头部
        res.setHeader(
            "Access-Control-Allow-Origin",
            corsConfig.origins.join(", "),
        );
        res.setHeader(
            "Access-Control-Allow-Methods",
            corsConfig.methods.join(", "),
        );
        res.setHeader(
            "Access-Control-Allow-Headers",
            corsConfig.headers.join(", "),
        );
        res.setHeader("Access-Control-Max-Age", "86400"); // 24小时

        // 处理预检请求
        if (req.method === "OPTIONS") {
            res.writeHead(204);
            res.end();
            return "handled";
        }

        return null;
    }

    /**
     * 速率限制中间件
     */
    rateLimit(req, res) {
        const rateConfig = this.config.security.rateLimit;

        if (!rateConfig.enabled) return null;

        const clientIp = req.socket.remoteAddress;
        const now = Date.now();

        // 清理过期记录
        this.cleanupRateLimit(now);

        // 获取或创建客户端记录
        let clientRecord = this.rateLimitStore.get(clientIp);

        if (!clientRecord) {
            clientRecord = {
                count: 1,
                resetTime: now + rateConfig.windowMs,
                firstRequest: now,
            };
            this.rateLimitStore.set(clientIp, clientRecord);
            return null;
        }

        // 检查是否超过限制
        if (clientRecord.count >= rateConfig.max) {
            const retryAfter = Math.ceil((clientRecord.resetTime - now) / 1000);

            res.setHeader("Retry-After", retryAfter);
            res.writeHead(429, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    error: "Too Many Requests",
                    message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
                }),
            );

            return "limited";
        }

        // 增加计数
        clientRecord.count++;
        res.setHeader("RateLimit-Remaining", rateConfig.max - clientRecord.count);

        return null;
    }

    /**
     * 清理速率限制存储
     */
    cleanupRateLimit(currentTime) {
        for (const [ip, record] of this.rateLimitStore.entries()) {
            if (record.resetTime <= currentTime) {
                this.rateLimitStore.delete(ip);
            }
        }
    }


    /**
     * 生成安全头部
     */
    setSecurityHeaders(res) {
        // 防止MIME类型嗅探,防止浏览器将非执行文件（如文本文件）错误解释为可执行代码
        res.setHeader("X-Content-Type-Options", "nosniff");

        // 控制页面是否可以在iframe中嵌入,防止点击劫持（Clickjacking）
        // DENY：完全禁止嵌入  SAMEORIGIN：只允许同源网站嵌入（当前选择）ALLOW-FROM uri：允许特定网站嵌入
        res.setHeader("X-Frame-Options", "SAMEORIGIN");

        // 启用浏览器的XSS过滤器，防止跨站脚本攻击
        // 1：启用XSS过滤  mode=block：检测到XSS攻击时阻止页面加载
        res.setHeader("X-XSS-Protection", "1; mode=block");

        // 防止跨域策略文件滥用,Adobe Flash、PDF等文件的跨域策略
        res.setHeader("X-Permitted-Cross-Domain-Policies", "none");

        // 跨域相关头部
        // 控制哪些网站可以加载资源,same-origin：仅同源 same-site：同站（同顶级域名）cross-origin：允许跨域（当前选择）
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        // 要求嵌入的资源必须是同源或明确允许跨域
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        // 防止恶意网站通过window.opener访问原始页面,新窗口与原始窗口隔离
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");

        // CSP - 内容安全策略
        // default-src 'self'：默认只允许加载同源的资源（同协议、同域名、同端口）
        // script-src 'self'：只允许执行来自同源的JavaScript
        // style-src 'self'：只允许加载同源的CSS样式
        // res.setHeader(
        //     "Content-Security-Policy",
        //     "default-src 'self'; script-src 'self'; style-src 'self'",
        // );

        // 功能权限策略
        // geolocation=()：禁止使用地理位置API
        // microphone=()：禁止使用麦克风
        // camera=()：禁止使用摄像头
        // res.setHeader(
        //     "Permissions-Policy",
        //     "geolocation=(), microphone=(), camera=()",
        // );

        // 推荐使用 HTTPS
        if (this.config.server.ssl) {
            // 强制浏览器使用HTTPS连接
            res.setHeader(
                "Strict-Transport-Security",
                "max-age=31536000; includeSubDomains", // 有效期1年（秒）,includeSubDomains：包含所有子域名
            );
        }
    }
}

export default SecurityMiddleware;
