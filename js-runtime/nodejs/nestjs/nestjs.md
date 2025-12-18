# nestjs
> 基于 typescript 的 nodejs 企业级框架
## 特点
* 大而全
* 单例模式，依赖注入
* 统一的异常处理
* 面向切面编程（AOP）
* 支持Typescript(引入了很多的高级语法)

## 安装
  ```bash
  npm i -g @nestjs/cli  # 全局安装 Nest
  nest new project-name  # 生成模版项目
  ```

## nest-cli 常用命令
 ```bash 
  nest -v 
  nest -h
  nest info        # 查看项目环境信息（Nest版本，Node版本等）

  # 生成一个rest风格的 usesr CRUD
  nest g res user

  # 生成在指定目录下
  nest g res user-center/user
 ```
* 创建顺序
  - 先创建 Module ->  Controller -> Service
  - 这样创建出来的文件在 Module 中自动注册，反之，后创建 Module, Controller 和 Service,会被注册到外层的 app.module.ts
* nest-cli.json 配置文件设置
  - spec:false 自动生成不产出测试文件
  ```json
    {
    "compilerOptions": {
      "deleteOutDir": true,
    },
    
    "generateOptions": {
      "spec": false
    }
  }

  ```

## 核心库
### 核心框架层
  > 这是构建 NestJS 应用的基石，包含了定义应用结构、依赖注入、模块化等最基础的功能
* @nestjs/common
  > 这是最常用、最核心的库，包含了大量的装饰器、枚举、类和工具函数。
  - 装饰器：用于声明类和各种元数据
  - @Module(): 定义一个模块
  - @Controller(): 定义一个控制器，用于处理路由
  - @Injectable(): 定义一个可被依赖注入的提供者（如 Service、Repository）
  - @Inject(): 手动注入一个依赖
  - @Get(), @Post(), @Put(), @Delete() 等：定义 HTTP 请求方法
  - @Body(), @Param(), @Query(), @Headers(): 提取请求中的数据

  - HttpException: 用于抛出标准 HTTP 异常。
  - 接口： 如 OnModuleInit, OnApplicationBootstrap 等生命周期钩子接口

* @nestjs/core 
  > 是 NestJS 的运行时引擎，它实现了依赖注入容器、模块系统、生命周期管理等核心运行时逻辑
  - NestFactory: 用于创建 NestJS 应用实例的静态类，例如 NestFactory.create(AppModule)
  - 依赖注入容器： 负责解析模块、提供者、控制器之间的依赖关系，并创建和管理它们的实例
  - 模块引用： 通过 ModulesContainer 等提供对已加载模块的访问
  - 应用生命周期： 管理应用的启动、停止等生命周期事件
  - 中间件、守卫、拦截器、管道 的执行上下文和调用链

### 平台抽象层
> NestJS 的核心设计是平台无关的。它通过平台适配器来支持不同的底层 HTTP 服务器框架。
* @nestjs/platform-express
  > 这是默认的平台适配器，将 NestJS 应用适配到 Express.js 框架上
  - 它创建了一个 Express 应用实例，并将 NestJS 的请求/响应对象映射到 Express 的 req 和 res 对象上。
  - 当你使用 NestFactory.create 时，默认使用的就是这个平台。
  - 可以通过 app.getHttpAdapter() 获取到底层的 Express 实例，以便使用特定的 Express 中间件。
* @nestjs/platform-fastify
  > 这是另一个官方支持的平台适配器，将 NestJS 应用适配到 Fastify 框架上。高性能和低开销
  - 使用方式： NestFactory.create(AppModule, new FastifyAdapter())
  - Fastify 提供了自己的一套请求/响应对象，该适配器负责将它们与 NestJS 的抽象进行桥接

### 官方集成库（常用）
* @nestjs/typeorm 与 @nestjs/mongoose
  - @nestjs/typeorm: 集成 TypeORM，主要用于关系型数据库（如 PostgreSQL, MySQL, SQLite）
  - @nestjs/mongoose: 集成 Mongoose，用于 MongoDB

* @nestjs/config
  > 用于管理应用程序的环境变量和配置
  - 基于流行的 dotenv 库
  - 提供 ConfigModule 和 ConfigService，支持 .env 文件、环境特定的配置、配置验证等功能
  - 是现代 NestJS 应用管理配置的首选方式

* @nestjs/jwt 与 @nestjs/passport
  > 实现身份认证和授权
  - @nestjs/jwt: 提供 JWT 的生成和验证工具。
  - @nestjs/passport: 集成了 Passport.js 这个流行的认证库，简化了各种认证策略（如 JWT, Local, OAuth）的实现。通常会与 @nestjs/jwt 结合使用来实现 JWT 策略

* @nestjs/swagger
  > 用于自动生成 OpenAPI 文档。
  - 通过一系列装饰器（如 @ApiProperty(), @ApiResponse()）为你的 DTO 和控制器添加元数据
  - 可以自动生成一个交互式的 API 文档界面（Swagger UI），极大地方便了前后端联调和 API 文档维护

* @nestjs/websockets
  - @nestjs/websockets: 用于实现 WebSocket 网关，支持双向实时通信

* @nestjs/microservices
  - 提供了一组装饰器（如 @MessagePattern(), @EventPattern()）和客户端，使 NestJS 应用能够轻松地作为微服务运行
  - 支持多种传输层协议，包括 TCP、Redis、MQTT、gRPC、Nats 等

### 其他核心包
* @nestjs/cli
  - NestJS 的命令行工具，是开发 NestJS 应用的脚手架和构建工具
  - 项目初始化、代码生成、项目构建与运行

* @nestjs/mapped-types
  - 一个基于 DTO 创建派生类的工具包，避免代码重复，特别是在创建类似的输入验证模型时
  - 它不仅会复制类的属性，还会复制相关的验证装饰器 和 Swagger 装饰器，确保派生类也拥有正确的验证规则和 API 文档元数据
  + 常见使用场景
    > 假设你有一个 CreateUserDto，用于创建用户时的验证。现在你需要一个 UpdateUserDto 用于更新用户，但更新时所有字段都应该是可选的。
   - 不使用 mapped-types：你需要手动复制 CreateUserDto 的所有字段，然后为每个字段加上 @IsOptional() 装饰器，非常繁琐且容易出错。
   - 使用 mapped-types：可以轻松地从 CreateUserDto 派生出 UpdateUserDto
   ```ts
    import { PartialType } from '@nestjs/mapped-types';

    // PartialType：生成一个新类，其中所有属性都变为可选的
    export class UpdateUserDto extends PartialType(CreateUserDto) {}

    // PickType：从原有类中挑选一组属性生成新类
    export class UserLoginDto extends PickType(CreateUserDto, ['email', 'password'] as const) {}

    // OmitType：从原有类中排除一组属性生成新类
    export class UserPublicProfileDto extends OmitType(User, ['password'] as const) {}

    // IntersectionType：将两个类合并成一个新类。
    export class UserWithRoleDto extends IntersectionType(User, Role) {}
   ```


* rxjs 
  > 一个用于响应式编程的库，用于使用 Observables 处理异步数据流。
  ```ts
    @Get()
    findAll(): Observable<User[]> {
        return this.userService.findAll$(); // 假设这个方法返回一个 Observable
    }
  ```

* reflect-metadata
  - 一个 Polyfill 库，为 JavaScript 提供了元数据反射 API
  - 问题：TypeScript 装饰器（如 @Injectable(), @Controller(), @Inject()）本身只是语法糖，它们需要一种机制来存储和读取附加到类、方法或属性上的元数据
  + 解决方案：reflect-metadata 就是这个机制。它允许 NestJS 在运行时
    - 知道一个类是否被 @Injectable() 装饰了（是一个提供者）。
    - 知道一个类是否被 @Controller('users') 装饰了，以及它的路由前缀是什么。
    - 知道一个构造函数的参数需要注入什么依赖（通过 @Inject('SomeService') 或基于类型）。

## 请求过程
* DTO（数据传输对象）
  - 全称是 data transfer object,他是一个对象，用于封装数据并将其从一个应用发送到另一个应用。DTO 帮助我们定义系统内的接口或者输入输出
  - dto 文件以.dto来命名方便识别
  ```ts
    // CreateUserDto.ts
    export class CreateUserDto{
      readonly name:string;
      // 可选
      readonly avatar?:string;
    }

    @Controller('user')
    export class UserController {
      constructor(private readonly userService: UserService) {}

      @Post('create')
      async create(@Body() createUserDto: CreateUserDto) {
        const { id } = await this.userService.create(createUserDto);
        return id;
      }

      @Post('update')
      update(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto
      ) {
        // console.log(typeof id);
        return updateUseroDto;
      }
    }
  ```
* 请求数据验证
  > 引入管道(Pipe),管道是具有 @Injectable() 装饰器的类。管道应实现 PipeTransform 接口 它会在请求到达 Controller 之前被调用，如果抛出了异常，则不会再传递给 Controller。 两个典型的应用场景：转换、验证，做数据验证做两件事  
  - 第一步在 main.ts 中 开起全局验证
    ```ts
      function bootstrap(){
        const app = await NestFactory.create<NestExpressApplication>(AppModule);
        // 开启全局管道参数验证
        app.useGlobalPipes(
          new ValidationPipe({
            // 开启白名单，并且自动删除不在dto 中的多余属性 
            whitelist: true,
            // 不在dto实体中的属性，报错并列出
            forbidNonWhitelisted: true,
            // transform 实例转换，同时把网络传输中的 string——>number 转换，对性能有轻微的影响
            transform: true,
            transformOptions: {
              enableImplicitConversion: true,
            },
          }),
        );
      }

    ```
  - 第二步安装两个插件 
    ```bash
      # class-validation 包含一些验证规则
      npm i class-validation class-transformer
    ```
    ```ts
    // CreateUserDto.ts
    import { IsNotEmpty, IsPhoneNumber, IsOptional,Length } from 'class-validator';
    export class CreateUserDto{
      @ApiProperty({
        example: '小茂',
        description: '姓名',
      })
      @IsNotEmpty({
        message: 'userName 不能为空',
      })
      @Length(100)
      @IsString()
      userName: string;

      // 可选参数的验证
      @IsPhoneNumber('CN', {
        message: 'phone 不是一个电话号码',
      })
      @IsOptional()
      phone?: string;
    }
    // 批量添加数组的验证
    
    ```
* 自定义验证装饰器
  ```ts
  import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
  export function IsLongerThan(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isLongerThan',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [property],
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            const [relatedPropertyName] = args.constraints;
            const relatedValue = (args.object as any)[relatedPropertyName];
            return typeof value === 'string' && typeof relatedValue === 'string' && value.length > relatedValue.length; // you can return a Promise<boolean> here as well, if you want to make async validation
          },
        },
      });
    };
  }
  ```
* 更新操作面临实体重复属性的问题？
  - 解决的方法
  ```ts
  import { PartialType } from '@nestjs/swagger';
  import { CreateUserDto } from './create-user.dto';

  export class UpdateUserDto extends PartialType(CreateDemoDto) {
    // PartialType的作用：
    // 1. 把 CreateDemoDto 所有属性设置为可选
    // 2. 继承 CreateDemoDto 的验证规则
    // 3. 避免冗余的代码
  }
  ```  
* 请求生命周期
  - 传入请求 -> 中间件(先全局后模块) -> 守卫（先全局次控制器后路由）-> 拦截器（先全局次控制器后路由）-> 管道(先全局次控制器后路由参数) -> 控制器 -> 服务 -> 异常过滤器（路由然后是控制器，然后是全局）-> 服务器响应

## middleware
* 是什么？
  - 是处理请求和响应的核心机制之一,可访问请求对象（Request）、响应对象（Response）和 next() 函数，用于在请求到达路由处理程序之前或之后执行特定逻辑。
  - NestJS 支持两种中间件形式：函数式中间件和类中间件。

* 中间件的核心作用
  - 执行任意代码（如日志记录、请求验证）。
  - 修改请求和响应对象。
  - 结束请求-响应周期（如权限拦截）。
  - 调用下一个中间件或路由处理程序。

* 类中间件（Class Middleware）
  - 通过 @Injectable() 装饰器实现 NestMiddleware 接口。
  ```ts
    // logger.middleware.ts
    import { Injectable, NestMiddleware } from '@nestjs/common';
    import { Request, Response, NextFunction } from 'express';
    @Injectable()
    export class LoggerMiddleware implements NestMiddleware {
        use(req: Request, res: Response, next: NextFunction) {
            console.log(`[${new Date().toISOString()}] Request to ${req.path}`);
            next(); // 必须调用 next() 否则请求会被挂起
        }
    }
    // 在模块的 configure 方法中注册（支持类和函数式中间件）。
    export class UserModule implements NestModule{
        configure (consumer:MiddlewareConsumer) {
            consumer.apply(LoggerMiddleware).forRoutes('user')
            // .forRoutes({path:'user',method:RequestMethod.GET})
            // forRoutes(UserController)
        }
    }
  ```

* 函数式中间件（Functional Middleware）
  - 适用于不需要依赖注入的简单场景。在 main.ts 中使用 app.use()，仅适用于函数式中间件。
  ```ts
    // 定义
    // logger.middleware.ts
    import { Request, Response, NextFunction } from 'express';
    export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
        console.log(`[Functional Middleware] Request to ${req.path}`);
        next();
    }
    // 应用
    async function bootstrap() {
        const app = await NestFactory.create(AppModule);
        app.use(loggerMiddleware)
        await app.listen(3000);
    }
    bootstrap();
  ```

* 依赖注入与中间件
  - 类中间件支持依赖注入，可以在构造函数中注入服务。
  ```ts
   // auth.middleware.ts
    @Injectable()
    export class AuthMiddleware implements NestMiddleware {
        constructor(private readonly authService: AuthService) {} // 依赖注入
        use(req: Request, res: Response, next: NextFunction) {
            if (!this.authService.validateToken(req.headers.token)) {
                throw new UnauthorizedException();
            }
            next();
        }
    }

    // 在模块中提供 AuthService
    @Module({
        providers: [AuthService],
    })
    export class AppModule implements NestModule {
        configure(consumer: MiddlewareConsumer) {
            consumer.apply(AuthMiddleware).forRoutes('*');
        }
    }
  ```

## 管道(Pipe)
* 可以分为 3 类：
  - parseXxx 把参数转为某种类型；
  - defaultValue 设置参数默认值；
  - validation 做参数的验证。
* 自带9个开箱即用的管道
  - ValidationPipe
  - ParseIntPipe
  - ParseFloatPipe
  - ParseBoolPipe
  - ParseArrayPipe
  - ParseUUIDPipe
  - ParseEnumPipe
  - ParseFilePipe
  - DefaultValuePipe



## 定时任务
* 任务的分类
  - cron job  固定的日期执行一次
  - intervals 指定的间隔后反复执行
  - timeouts 延迟多长时间执行一次
* 获取所有的任务和状态
  ```ts
    @ApiOperation({ summary: '获取所有CronJob的信息' })
    @Get('getCronJobs')
    getCronJobs() {
      const jobs = this.schedulerRegistry.getCronJobs();
      const jobList = [];
      jobs.forEach((value, key) => {
        let next;
        try {
          const nextDate = value.nextDates().toJSDate();
          next = dayjs(nextDate).format('YYYY-MM-DD HH:mm:ss');
        } catch (e) {
          next = 'error: next fire date is in the past!';
        }
        jobList.push({
          job: key,
          nextDate: next,
          running: value.running,
        });
      });
      return jobList;
    }
  
  const intervals = this.schedulerRegistry.getIntervals();
  const timeouts = this.schedulerRegistry.getTimeouts();
  ```
* 动态配置任务执行的时间
  ```ts
  @ApiOperation({ summary: '动态配置job执行的时间' })
  @Get('setJobTime')
  setTime(@Query() jobDto: JobDto) {
    // stops a job, sets a new time for it, and then starts it
    const job = this.schedulerRegistry.getCronJob(jobDto.jobName);
    job.setTime(new CronTime(jobDto.jobTime));
  }
  ```
* 手动控制任务的开始与停止
  ```ts
   const job = this.schedulerRegistry.getCronJob(jobName);
    if (job.running) {
      job.stop();
    } else {
      job.start();
    }
  ```
* 集群场景下数据重复的问题？
  - TODO

## 测试
* package.json
  ```json
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  ```
* 单元测试
 > 适用于一个类中的函数
  ```bash
  # 运行单元测试
  npm run test
  # 运行单元测试和覆盖率
  npm run test:cov
  ```
* 端到端测试
 > 适用于整个系统的测试
  ```bash
  npm run test:e2e
  ```
