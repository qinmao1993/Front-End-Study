# Token 续期问题如何解决

## Token 过期导致的问题？
用户操作中断，如提交大表单时 Token 突然过期影响用户体验

## Token 续期的三大核心问题
* 何时续期：提前多久刷新最合理？
* 如何续期：单 Token 还是双 Token？有状态还是无状态？
* 安全防控：如何防止令牌劫持和并发风暴？

## 解决方案一（双 Token 方案 Refresh Token 和 Access Token）
> 短期 Token + 刷新 Token 机制 + 黑名单机制（主动吊销 Token）
* 解决思路：
  1. 用户登录后，服务器返回两个 Token，accessToken 有效期短 如 30m,用于访问受保护的资源。 refreshToken 用于获取新的 accessToken，它的有效期更长 如 7d，使用 HttpOnly cookies 存储 Refresh Token
  2. 当接口报 accessToken 过期时，用 refreshToken 置换新 token，在置换期间，新的请求直接返回同样置换token请求实例。置换完拿新token,重试请求

* 适用场景
  - SPA、移动端
* 优势
  - 移动端和 Web 端统一认证

## 解决方案二：滑动过期时间的方案
* HTTP-Only Cookie + 服务端会话管理
  + 解决思路：
    - 在登录接口中，将 JWT 通过 HTTP-Only Cookie 返回给前端：
    ```ts
        // auth.controller.ts
        @Post('login')
        async login(@Res() res: Response, @Body() loginDto: LoginDto) {
            const user = await this.authService.validateUser(loginDto);
            const token = this.authService.generateToken(user);
            // 将 Token 写入 HTTP-Only Cookie
            res.cookie('access_token', token, {
                httpOnly: true,    // 禁止前端 JS 访问
                secure: process.env.NODE_ENV === 'production', // 仅 HTTPS 传输
                sameSite: 'strict', // 防止 CSRF
                maxAge: 24 * 60 * 60 * 1000, // Cookie 过期时间（服务端 Token 过期时间更短）
            });
            return res.send({ success: true });
        }
    ```
    - 通过全局中间件或守卫，在每次请求时检查 Token 的剩余有效期，自动续期：
      ```ts
        // token-renew.middleware.ts
        import { Injectable, NestMiddleware } from '@nestjs/common';
        import { Request, Response, NextFunction } from 'express';
        import { JwtService } from '@nestjs/jwt';
        @Injectable()
        export class TokenRenewMiddleware implements NestMiddleware {
            constructor(private readonly jwtService: JwtService) {}
            use(req: Request, res: Response, next: NextFunction) {
                const token = req.cookies.access_token;
                if (token) {
                    try {
                        const decoded = this.jwtService.verify(token);
                        const now = Date.now() / 1000;
                        const expiresIn = decoded.exp - now;

                        // 如果 Token 剩余时间小于 15 分钟，则续期
                        if (expiresIn < 15 * 60) {
                        const newToken = this.jwtService.sign(
                            { userId: decoded.userId },
                            { expiresIn: '1h' } // 新 Token 有效期 1 小时
                        );

                        // 静默更新 Cookie
                        res.cookie('access_token', newToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 24 * 60 * 60 * 1000,
                        });
                        }
                    } catch (e) {
                        // Token 无效或过期，清除 Cookie
                        res.clearCookie('access_token');
                    }
                }
                next();
            }
        }
      ```
  + 适用场景：
    - 适用于需要高安全性和简化前端逻辑的 Web 应用（如传统多页应用、SSR 项目）
  + 优势：自动续期，无感知登录
