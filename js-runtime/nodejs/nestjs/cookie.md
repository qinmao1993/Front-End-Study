# NestJS 中 Cookie 的详细用法
在 NestJS 中使用 Cookie 主要涉及设置、读取和管理客户端 Cookie。下面详细介绍各种用法：

## 安装依赖
  ```bash
    npm install cookie-parser
    npm install @types/cookie-parser -D
  ```

## 配置 Cookie 中间件
  - 在 main.ts 中配置 cookie-parser
  ```ts
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
    import * as cookieParser from 'cookie-parser';

    async function bootstrap() {
        const app = await NestFactory.create(AppModule);
        
        // 使用 cookie-parser 中间件
        app.use(cookieParser());
        
        
        await app.listen(3000);
    }
    bootstrap();
  ```

## 设置 Cookie
    ```ts
    import { Controller, Get, Res } from '@nestjs/common';
    import { Response } from 'express';

    @Controller('auth')
    export class AuthController {
        @Get('login')
        login(@Res() res: Response) {
            // 设置
            res.cookie('sessionId', 'abc123xyz', {
                // 设置 Cookie 的相对过期时间（从当前时间算起）以毫秒为单位，7天后过期
                // 比 expires 更直观易用
                maxAge: 7 * 24 * 60 * 60 * 1000, 

                // 设置 Cookie 的绝对过期时间, 7天后过期
                // expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 

                httpOnly: true, // 防止 XSS 攻击,前端访问不到


                // secure: true, // 仅在 HTTPS 下传输

                // 指定 Cookie 的有效域名,默认为当前域名,可以设置为父域名，使所有子域名共享 Cookie
                domain: 'example.com', 
                // 如当前域名：api.example.com
                res.cookie('shared_data', 'value', { 
                    domain: '.example.com' // 所有子域名都可访问
                });

                // 指定 Cookie 的有效路径,默认是 / （整个域名都有效）只有该路径及其子路径可以访问 Cookie
                // path: '/', 

                // 控制跨站请求时是否发送 Cookie
                // strict：严格模式，完全禁止跨站请求发送 Cookie
                // lax：宽松模式，允许部分安全的跨站请求（如导航链接）
                // none：允许所有跨站请求（必须同时设置 secure: true）
                // boolean：true 等同于 strict，false 等同于 none
                sameSite: 'strict', // 开启 CSRF 防护

                // signed: true, // 签名（如果配置了密钥）
            });

            // 清除 Cookie
            res.clearCookie('sessionId');

            return res.send('Login successful');
        }
    }
    ```
    
## 读取 Cookie
  ```ts
    import { Controller, Get, Req } from '@nestjs/common';
    import { Request } from 'express';

    @Controller('user')
    export class UserController {
        @Get('profile')
        getProfile(@Req() req: Request) {
            // 读取普通 Cookie
            const username = req.cookies['username'];
            
            // 读取签名 Cookie（如果使用了签名）
            const sessionId = req.signedCookies['sessionId'];
            
            return {
                username,
                sessionId,
            };
        }
    }
  ```