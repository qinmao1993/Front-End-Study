# nestjs 初始化鉴权
这篇文章由登录鉴权为例引出 nestjs 中的各种概念，如装饰器、module、providers、守卫、拦截器、管道、过滤器、中间件

## 背景
之前做了一个使用 nestjs 框架搭建的服务端项目，现在复盘并深入了解 nestjs 的概念。由登录鉴权逐步引入

## 装饰器
> 是 nestjs 框架的核心
* 先看一段登录的代码，其中发现大量的一@符号开头的东西,如@Body()  @Public()、@Post('loginByPassword')...,这玩意是什么，它有什么用,底层是如何实现的，如何自定义装饰器？
  ```ts
    @ApiTags('用户认证')
    @Controller('auth')
    export class AuthController {
        constructor(private readonly authService: AuthService) {}
        @UseGuards(LocalAuthGuard)
        @Public()
        @Post('loginByPassword')
        login(@Req() req, @Session() session, @Body() loginUser: LoginUser) {
            // 生成 token
            const token = this.authService.sign(req.user);
            return token;
        }
    }
  ```

* 是什么问题？
  - 上面的那些东西是被称为 ts 装饰器，用于增强类、方法、属性等功能的特殊语法
  - 在 NestJS中 装饰器是一种强大的元编程工具，用于增强类、方法、参数的功能

* 详情参见 [ts装饰器使用指南](/开发语言/typescript/ts装饰器.md)
  
* NestJS 中装饰器的作用？
  - 路由定义：@Controller、@Get、@Post 等定义 API 端点。
  - 依赖注入：@Injectable、@Inject 管理服务与依赖。
  - 请求处理：@Body、@Param、@Query 提取请求数据。
  - 鉴权与验证：@UseGuards、@UsePipes 添加中间件逻辑。
  - Swagger 文档：@ApiTags 自动生成 API 文档。

* nestjs 如何自定义装饰器？
  ```ts
    // 案例1：自定义参数装饰器:提取当前用户信息
    import { createParamDecorator } from '@nestjs/common';
    export const CurrentUser = createParamDecorator(
        (data: unknown, ctx: ExecutionContext) => {
            const request = ctx.switchToHttp().getRequest();
            return request.user; // 从请求对象中提取用户信息
        }
    );
    // 使用
    @Get('profile')
    getProfile(@CurrentUser() user: User) {}


    // 案例2：自定义一个 public 装饰器，表示不需要jwt验证
    // 本质就是在被修饰的对象上添加元数据，做一个标记

    // 实现方式一：更灵活
    // src/decorators/public.decorator.ts
    import { Reflector } from '@nestjs/core';

    // 定义元数据键名
    const IS_PUBLIC_KEY = 'isPublic';

    // 创建装饰器工厂
    export function createPublicDecorator() {
        return (target: any, key?: string | symbol, descriptor?: PropertyDescriptor) => {
            Reflect.defineMetadata(IS_PUBLIC_KEY, true, descriptor?.value || target);
        };
    }

    // 生成 @Public() 装饰器
    export const Public = createPublicDecorator();

    // 实现方式二：SetMetadata (推荐)
    import { SetMetadata } from '@nestjs/common';
    export const Public = () => SetMetadata('isPublic', true);

    // SetMetadata 这又是什么玩意？
    // 这是 NestJS 内置的 元数据设置装饰器工厂，用于向类、方法或参数附加自定义元数据
    // 第一个参数 'isPublic' 是元数据的 键（Key），第二个参数 true 是 值（Value）。
    // 标记目标（如控制器方法）带有 { isPublic: true } 的元数据

    // 使用
    @Public()
    @Post('loginByPassword')
    login(@Req() req, @Body() loginUser: LoginUser) {
        // 生成 token
        const token = this.authService.sign(req.user);
        return token;
    }
  ```

* 上面核心装饰器介绍完，就开始实现登录鉴权过程

## passport
* 登录鉴权思路
  - 用户名和密码进行身份验证。一旦通过身份验证，服务器将发送一个 JWT，该 JWT 可以在后续请求中作为 授权标头中的不记名令牌 发送以证明身份验证
* passport是最流行的 node.js 身份验证库
  - 拥有丰富的 strategies 生态系统，实现了各种身份验证机制,并将这些不同的步骤抽象为一个标准模式
  - 如 passport-local 的策略，它实现了用户名/密码身份验证机制，passport-jwt 的策略，实现了jwt的身份验证机制
* 安装包
  ```bash
    # 不管选择什么策略， @nestjs/passport passport这两包都要安装
    npm i @nestjs/passport passport passport-local 
    npm install -D @types/passport-local
  ```
* 如何使用这些包？
  - 如下代码，在指定路径下建立一个本地验证策略的文件，并引入相关依赖包
  - 本段代码功能就是完成本地账号和密码的验证
    ```ts
    // auth/strategy/local.strategy.ts
    import { Strategy } from 'passport-local';
    import { PassportStrategy } from '@nestjs/passport';
    import { Injectable, UnauthorizedException } from '@nestjs/common';
    import { AuthService } from './auth.service';

    @Injectable()
    export class LocalStrategy extends PassportStrategy(Strategy) {
        constructor(private readonly authService: AuthService) {
            // 调用 super 传递策略参数， 默认是 username 和 password，一样可以不用写
            // 如用邮箱进行验证，参数是 email, 那 usernameField 对应的字段就是 email。
            super({
                usernameField: 'account',
                passwordField: 'password',
            } as IStrategyOptions);
        }
        async validate(account: string, password: string) {
            // 查询数据库验证
            const userInfo = await this.authService.validateUser(account, password);
            if (!userInfo) {
                // 没有找到用户信息，抛出401异常
                throw new UnauthorizedException();
            }
            return userInfo; // 返回的除密码外的单表信息
        }
    }
    ```
  + 这段代码是如何工作的？
    1. 定义 LocalStrategy 类，并被 @Injectable()装饰器装饰，表示该类可被注入到其他类中。继承了 PassportStrategy 类，并传入 Strategy 作为参数，表示使用 passport-local 策略。
    2. PassportStrategy 这个父类中定义了一个抽象方法 validate，子类中要去具体实现。Passport 的本地策略（passport-local）会默认从请求体（req.body）中提取参数传递给 validate 方法。 在 validate 中具体实现验证的业务逻辑，成功返回的用户信息，会被 Passport 处理，并挂载到请求对象的 user 属性上。
    - 此时本地身份验证的逻辑就完成了。我们建个路由的控制器等待用户访问。
* 建立授权的控制器
  ```ts
    @Controller('auth')
    export class AuthController {
        constructor() {}
        @Post('loginByPassword')
        login(@Req() req, @Body() loginUser: LoginUser) {
            
        }
    }
  ```
  + 在该段代码中如何结合上面完成的本地身份验证策略代码，完成身份验证？
    - 当客户端携带账号和密码请求过来时，从 body 中 可以接收到 LoginUser 这个实体，数据在该实体中。
    - 此时我们想到了上面介绍过的方法装饰器，可以改变类中方法的行为。我们可以自定义一个方法的装饰器，实现参数的获取，实现验证逻辑，然后在调用自身。这样两个就能结合再一起了。
    - 在 @nestjs/common 库中，平台已经实现了 @UseGuards 这个装饰器。这个翻译过来使用守卫。守卫我们想到了前端的路由守卫钩子。他们的功能都是做一些请求的拦截，下面具体看一下 nestjs 中守卫的概念。

## guard
> 对守卫我们关注3个问题，它是什么怎么用，在整个请求生命周期中处在什么位置，并基于该特性的应用场景是什么？
* 守卫是什么？
  - 一句话使用就是 使用 @Injectable() 装饰器的类，实现 CanActivate。于是我们自定义一个守卫test。
  ```ts
    import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
    import { Observable } from 'rxjs';
    @Injectable()
    export class TestGuard implements CanActivate {
         canActivate(
             context: ExecutionContext,
         ): boolean | Promise<boolean> | Observable<boolean> {
            // 从执行上下文中可以获取请求相关参数
            // TODO 验证逻辑
             console.log('经过了守卫');
             return true;
         }
    }
    // 这段代码很简单，就是 TestGuard 内中实现了 接口中 CanActivate 方法，返回一个布尔类型，或者异步的布尔类型
    // CanActivate 方法中有 执行上下文这个参数
  ```
  + 简单的使用
    - 我们先要学习一下 @UseGuards 装饰器的用法，他的参数就是定义的守卫
    ```ts
        // 在 controller 中使用
        @Controller('auth')
        export class AuthController {
            constructor() {}
            @UseGuards(TestGuard)
            @Post('loginByPassword')
            login(@Req() req, @Body() loginUser: LoginUser) {
                
            }
        }
        // 当我们请求 /auth/loginByPassword 接口时，就会打印 ”经过了守卫"
    ```
* 守卫是如何从执行上下文中获取请求数据，如何获取到装饰对象的元信息的呢？
  - 这个问题关系到守卫的作用及应用场景,看以下代码
  ```ts
    // test.guard.ts'
    import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
    import { Observable } from 'rxjs';
    import { Reflector } from '@nestjs/core'
    @Injectable()
    export class TestGuard implements CanActivate {
        constructor(private reflector: Reflector) {}
        canActivate(
            context: ExecutionContext,
        ): boolean | Promise<boolean> | Observable<boolean> {
            // 从执行上下文中可以获取请求相关参数
            const request = context.switchToHttp().getRequest<Request>()
            // 通过反射获取元信息: 还记得前面说的自定义的装饰器 @public 吗，它给 login 方法上定义了 元信息 isPublic=true
            const isPublic = this.Reflector.get<string[]>('isPublic', context.getHandler())
            
            console.log('isPublic:',isPublic,'request:body:',request['body'])
            console.log('经过了守卫');
            return true;
        }
    }
    // auth.controller.ts
    import { TestGuard } from './test.guard.ts'
    @Controller('auth')
    export class AuthController {
        constructor() {}
        @Public()
        @UseGuards(TestGuard)
        @Post('loginByPassword')
        login(@Req() req, @Body() loginUser: LoginUser) {
            
        }
    }
    // 客户端发送请求 /auth/loginByPassword 发现数据正常打印了,
    // 我们还要考虑一下 守卫在整个请求生命周期中处在什么位置。
  ```
* 完整的请求生命周期？
  传入请求 -> 中间件(先全局后模块) -> 守卫（先全局次控制器后路由）-> 拦截器（先全局次控制器后路由）-> 管道(先全局次控制器后路由参数) -> 控制器 -> 服务方法 -> 异常过滤器（路由然后是控制器，然后是全局）-> 服务器响应
* 守卫的应用场景
  > 基于以上特性，我们发现守卫主要处理与路由相关的权限控制，我们可以考虑在接下来的业务场景中实现一下功能
  - 权限控制：验证用户身份（如 JWT 校验）或检查用户角色/权限。
  - 请求拦截：根据条件（如 IP 白名单）决定是否放行请求。
  - 逻辑分离：将权限校验逻辑从控制器中解耦，提升代码可维护性。
* 守卫的用法
  + 应用
    - 作用局部：用在方法上、整个控制器
    - 作用全局：作用于所有路由
    ```ts
        // app.module
        providers: [
            {
                provide: APP_GUARD,
                useClass: JwtAuthGuard,
            },
        ],

    ```
  + 依赖注入
    - 守卫支持依赖注入，可通过构造函数注入服务：
    ```ts
    @Injectable()
    export class AuthGuard implements CanActivate {
        constructor(private authService: AuthService) {}
        canActivate(context: ExecutionContext) {
            // 使用 this.authService 进行校验
        }
    }
    ```
* 介绍完了守卫，之前的身份验证策略代码如何结合？
  - 我们建立一个本地身份验证守卫，传入@UseGuards(LocalAuthGuard) 就可以了
  ```ts
    import { Injectable } from '@nestjs/common';
    import { AuthGuard } from '@nestjs/passport';

    // 定义一个本地身份验证守卫
    @Injectable()
    export class LocalAuthGuard extends AuthGuard('local') {}
  ```
  - AuthGuard:是 NestJS 对 Passport 的封装，用于处理身份验证逻辑。它会自动调用 Passport 策略进行验证，需要传入一个策略的名称。
  - passport-local 默认名称 就是 local
  + AuthGuard 底层是如何运行的了？
    > 结合上面定义的 TestGuard的守卫，我们可以猜测，他的执行流程。
    - 首先 执行父类（AuthGuard）的 canActivate 方法。
    - 通过传入的策略名称，启动策略验证流程。提取凭证，调用开发者提供的 validate 方法（LocalStrategy 中定义）成功返回true,守卫允许请求继续。
    > 吐槽一句封装的太多也不是好事，都不好理解了。还不如自己手写守卫呢。
  + 此时我们思考一个问题，如果我想在启动策略验证之前，还想做一些逻辑判断操作怎么办？
    - 我们的解决方案是重写它的 canActivate 方法。如下代码，这下和之前写的 TestGuard 守卫就像了，也好理解了。
    ```ts
        @Injectable()
        export class LocalAuthGuard extends AuthGuard('local') {
            constructor(private reflector: Reflector) {
                super();
            }
            canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
                const isExist = this.reflector.getAllAndOverride<boolean>('isPublic', [
                    context.getHandler(),
                    context.getClass(),
                ]);
                if(isExist){
                    console.log('不用执行身份验证策略，直接放行')
                    return isExist
                }
                return super.canActivate(context); // 继续执行本地身份验证策略
            }
        }
    ```
    - 在后面客户端携带 token 请求做jwt鉴权时，需要放行一些接口如登录注册，可通过重写 canActivate 解决

## Module 
* 上面介绍的本地身份验证功能基本上都实现了。我们建立一个完整的代码。
  ```ts
    // auth.controller.ts
    @ApiTags('用户认证')
    @Controller('auth')
    export class AuthController {
        constructor(private readonly authService: AuthService) {}
        @ApiOperation({
            summary: '用户密码登录',
        })
        @ApiSecurity('public') // 覆盖全局授权配置
        @UseGuards(LocalAuthGuard)
        @Public()
        @Post('loginByPassword')
        login(@Req() req, @Session() session, @Body() loginUser: LoginUser) {
            // 本地策略验证成功，验证验证码是否正确
            // 生成 token
            const token = this.authService.login(req.user);
            return token;
        }
    }
    // auth.service.ts
    @Injectable()
    export class AuthService {
        constructor(
            private readonly userService: UserService,
        ) {}
        /**
        * 检索用户并验证密码,成功返回用户信息
        * @param account
        * @param password
        */
        async validateUser(account: string, password: string) {
            // 单表查询
            const userInfo = await this.userService.findOneByName(account);
            if (!userInfo) {
                throw new BusinessException('不存在该用户！');
            }
            const { password: hashPassword, ...result } = userInfo;
            const loginHashPwd = createHmac('sha256', 'linzaiyyds')
            .update(password)
            .digest('hex');

            if (loginHashPwd !== hashPassword) {
                throw new BusinessException('密码错误！');
            }
            return result;
        }
        /**
         * 生成 token
        * @param user
        * @returns
        */
        login(user: any) {
            // 自定义载荷
            const { id, account } = user;
            const payload = { id, account };
            const access_token = this.jwtService.sign(payload);
            return access_token;
        }
    }
  ```
* 构造函数的只读参数的疑问？
  - authService、userService从哪来的，他们的运行流程是怎么的？带这这些疑问来学习 nestjs 的模块系统
* 模块的基本概念
  - 模块是带有 @Module() 装饰器的类，用于将相关功能（如控制器、服务等）组织在一起。每个 NestJS 应用至少有一个根模块（通常是 AppModule）
  ```ts
    @Module({
        imports: [
            UserModule
        ],
        controllers: [AuthController],
        providers: [AuthService],
        exports: [AuthService],
    })
    export class AuthModule {}
  ```
  + 模块装饰器参数
    - imports：导入其他模块，使其导出内容在当前模块可用。
    - controllers：注册模块内的控制器，处理 HTTP 请求。
    - providers：注册模块内的服务（Provider），供依赖注入使用。
    - exports：导出本模块的 Provider 或模块，供其他模块使用。
* 模块的类型
  - 共享模块 exports 导出才能在其他模块使用
  - 全局模块：通过 @Global() 装饰器声明，所有模块无需显式导入即可使用其导出内容。
    ```ts
        @Global()
        @Module({
            providers: [ConfigService],
            exports: [ConfigService],
        })
        export class ConfigModule {}
    ```
  - 动态模块：在运行时动态配置的模块，通过静态方法（如 forRoot()、register()）返回配置后的模块
  ```ts
    @Module({})
    export class DatabaseModule {
        static forRoot(config: Config): DynamicModule {
            return {
                module: DatabaseModule,
                providers: [
                    { provide: DATABASE_CONFIG, useValue: config },
                    DatabaseService,
                ],
                exports: [DatabaseService],
            };
        }
    }

    // 使用：
    @Module({
        imports: [
            DatabaseModule.forRoot({ host: 'localhost' })
        ],
    })
    export class AppModule {}
  ```
* 模块的依赖注入
  - 默认情况下，Provider 是单例的。若模块在多个地方导入，仍共享同一实例。
  - 依赖解析：模块通过 imports 导入的模块中导出的 Provider，可在本模块直接注入。
  - 示例：UserService 依赖 LoggerService（来自 SharedModule）：
  ```ts
    @Module({
        imports: [SharedModule], // 导入 SharedModule
        providers: [UserService],
    })
    export class UserModule {}

    // UserService 中使用 LoggerService
    @Injectable()
    export class UserService {
        constructor(private logger: LoggerService) {}
    }
  ```
* 模块生命周期钩子
  ```ts
  @Module({})
  export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
    onModuleInit() {
        console.log('DatabaseModule initialized');
    }
    onModuleDestroy() {
        console.log('DatabaseModule destroyed');
    }
  }
  ```
* 循环依赖与解决方案
  - 若模块 A 导入模块 B，模块 B 又导入模块 A，需使用 forwardRef() 解决循环依赖：
  ```ts
    // UserModule
    @Module({
        imports: [
            forwardRef(() => AuthModule)
        ],
    })
    export class UserModule {}
    // AuthModule
    @Module({
        imports: [
            forwardRef(() => UserModule)
        ],
    })
    export class AuthModule {}
  ```

## provider
> 学了 module 我们在学习一下 providers
* provider（提供者）是什么？
  - Provider 是用 @Injectable() 装饰器标记的类（如 Service、Repository、Helper 等），也可以是值、工厂函数或其他动态生成的对象。
  - @Injectable() 装饰器标记的类。这句话有没有熟悉的感觉，之前的讲的本地身份验证策略和守卫都是 @Injectable 装饰器注释的类，表示可以被注入类中。
  - 默认情况下，Provider 是单例的（整个应用共享同一个实例）。
* provider作用
  - 封装可复用的逻辑（如数据库操作、业务规则）。
  - 通过依赖注入实现解耦，提升代码可维护性和可测试性。
* provider 的类型
  - 标准类 Provider（Class Provider）通常用于服务类。
  ```ts
    // demo-module.ts
    @Module({
        providers: [
            DemoService, // 简写形式，等价于 { provide: DemoService, useClass: DemoService }
                         // 也可以自定义名称 { provide: "ABC", useClass: DemoService } 
        ]
        // demo-controller.ts 
        // 自定义名称需要用对应的 Inject 取不然会找不到
        export class DemoController {
            constructor(
                @Inject('ABC') private readonly demoService: DemoService,
            ) {}
        }
  ```
  - 值 Provider（Value Provider）
  ```ts
    @Module({
        providers: [{
            provide: "JD",
            useValue: ['TB', 'PDD', 'JD']
        }]
    })
    export class DemoService {
        constructor(
            @Inject('JD') private readonly shopList: string [],
        ) {}
    }
  ```
  - 工厂 Provider（Factory Provider）
    ```ts
       // 通过工厂函数动态创建 Provider 实例，适用于需要依赖其他 Provider 或运行时配置的场景。
       // database.provider.ts
        @Injectable()
        export class DatabaseService {
            constructor(private config: ConfigService) {}
        }
        // database.module.ts
        @Module({
            providers: [{
                    provide: DatabaseService,
                    useFactory: (config: ConfigService) => {
                        return new DatabaseService(config);
                    },
                    inject: [ConfigService], // 注入依赖
                },
            ],
            exports: [DatabaseService],
        })
        export class DatabaseModule {}
    ```
  - 异步工厂 Provider（Async Factory Provider）
  ```ts
   // 工厂函数返回 Promise 或 Observable，用于异步初始化（如连接数据库）。
    @Module({
        providers: [{
                provide: 'ASYNC_CONNECTION',
                useFactory: async () => {
                    const connection = await createConnection({ /* 配置 */ });
                    return connection;
                },
            },
        ],
    })
    export class AppModule {}  
  ```

## 依赖注入(DI)底层是怎么实现的？
> 现在可以来解释之前的构造函数中只读参数的疑问。provider 提供的依赖是怎么被注入的构造函数参数中的？
1. 以 UserService 类为例，使用 @Injectable() 装饰时，NestJS 会为该类生成元数据，保存其类类型
  ```ts
    @Injectable()
    export class UserService {}
  ```
2. Provider 的注册
  - 在模块的 providers 数组中注册 Provider，告知 DI 容器如何创建实例
  ```ts
    @Module({
        providers: [UserService], // 注册 UserService 等价于
        // providers: [{ provide: UserService, useClass: UserService }]
    })
    export class UserModule {}
  ```
3. 依赖解析过程：当实例化一个类（如控制器或服务）时
  ```ts
    @Controller()
    export class UserController {
        constructor(private userService: UserService) {} // UserService 的类型信息被保留
    }
  ```
  + 分析构造函数参数，通过反射获取参数的类类型（如 UserService）。
  + 确定令牌（Token）：
    - 类类型参数：直接使用类本身作为令牌（如 UserService）。
    - 非类类型参数：需用 @Inject() 显式指定令牌（如 @Inject('LOGGER')）。
  + 查找 Provider：
    - DI 容器根据令牌查找已注册的 Provider 定义（如 { provide: UserService, useClass: UserService }）
4. 实例化 Provider：
    - 若 Provider 是类（useClass），递归解析其依赖并创建实例
    - 若 Provider 是值（useValue），直接使用提供的值。
    - 若 Provider 是工厂（useFactory），调用工厂函数生成实例。
    - 若 Provider 是别名（useExisting），指向另一个已注册的 Provider。
5. 将解析后的实例传递给构造函数参数，实现注入

* 简单一点总结
  - 元数据保留：利用 TypeScript 的装饰器元数据功能，保存构造函数参数的类型信息。
  - 令牌匹配：根据参数类型或 @Inject() 指定的令牌，查找注册的 Provider。
  - 实例化与注入：DI 容器按需创建实例（单例/作用域控制），并注入到目标类中。

## 完整登录鉴权代码
> 到此所之前所有的疑问都解决了。完整登录鉴权代码如下
  ```ts
    // auth/strategy/jwt.strategy.ts
    import { ExtractJwt, Strategy } from 'passport-jwt';
    import { PassportStrategy } from '@nestjs/passport';
    @Injectable()
    export class JwtStrategy extends PassportStrategy(Strategy) {
        constructor(
            private readonly userService: UserService,
            private configService: ConfigService,
        ) {
            super({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: configService.get('JWT_CONFIG').secret, 
                ignoreExpiration: false,
            });
        }
        async validate(payload: any) {
            console.log('payload', payload);
            return payload;
        }
    }

    //  auth/auth.module.ts
    @Module({
        imports: [
            UserModule,
            // 注册 Passport 模块，并设置默认的验证策略是 jwt
            PassportModule.register({ defaultStrategy: 'jwt' }),
            // 注册 jwt动态模块
            JwtModule.registerAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => ({
                    secret: config.get('JWT_CONFIG').secret, // jwt 的秘钥
                    signOptions: { expiresIn: config.get('JWT_CONFIG').expiresIn }, // access_token 的有效期
                }),
            }),
        ],
        controllers: [AuthController],
        providers: [AuthService, LocalStrategy, JwtStrategy],
        exports: [AuthService],
    })
    export class AuthModule {}

    // jwt 验证守卫
    @Injectable()
    export class JwtAuthGuard extends AuthGuard('jwt') {
        constructor(private reflector: Reflector) {
            super();
        }
        // 重写 canActivate，handleRequest，
        // 用于自定义响应逻辑
        canActivate(context: ExecutionContext) {
            // JwtAuthGuard 作为全局验证，但有的时候也是需要针对于部分接口开启白名单。例如，登录接口就需要开启白名单
            // 如果方法或类上存在 public 装饰器，则不做jwt鉴权验证
            const isExist = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
            ]);

            if (!isExist) {
                return super.canActivate(context);
            }
            return isExist;
        }

        // 异常捕获的处理。
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handleRequest(err, user, info, context, status) {
            // 可以抛出一个基于info或者err参数的异常
            if (err || !user) {
            throw (
                err ||
                new BusinessException({
                code: BUSINESS_ERROR_CODE.TOKEN_INVALID,
                message: 'token 已失效',
                })
            );
            }
            return user;
        }
    }
  ```