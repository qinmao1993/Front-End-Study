# TS
> TypeScript（简称 TS）是微软公司开发的一种基于 JavaScript （简称 JS）语言的编程语言。它的目的并不是创造一种全新语言，而是增强 JavaScript 的功能，使其更适合多人合作的企业级项目。
## 安装
  ```bash
    npm i typescript -g

    tsc -v
    # 显示基本可用的帮助信息
    tsc -h
  ```
## 编译器
> 将ts编译成js才能执行，有以下几种编译器
* tsc
  + 优点
    - 官方提供的编译器,完全支持 TypeScript 的所有特性
    - 配置简单，直接使用 tsconfig.json 文件。
    - 支持增量编译，提高编译速度。
  + 缺点：
    - 编译速度相对较慢，尤其是在大型项目中。
    - 仅负责编译，不处理模块打包、代码压缩等任务。
  + 用法
    ```bash
        # 编译ts文件，支持一次编译多个
        tsc demo1.ts demo2.ts

        # 将多个 TypeScript 脚本编译成一个 JavaScript 文件
        tsc file1.ts file2.ts --outFile app.js

        # 编译结果默认都保存在当前目录，--outDir参数可以指定保存到其他目录
        tsc app.ts --outDir dist

        # 为了保证编译结果能在各种 js 引擎运行，tsc 默认会将 ts 代码编译成很低版本的js，即3.0版本（以es3表示）。
        tsc --target es2015 app.ts
    ```
* swc
  - 基于 Rust 编写的高性能 JavaScript/TypeScript 编译和打包工具。它主要用语法降级、代码压缩等场景，其核心优势在于极致的编译速度。通常比 Babel 快数十倍
  - 无类型检查
  ```bash
    # 安装 CLI
    npm install -g @swc/cli @swc/core
    # 编译单个文件
    swc ./src/index.ts -o ./dist/index.js
    # 通常会在项目根目录创建 .swcrc 配置文件来统一规则
  ```
  ```json
    {
    "jsc": {
        "parser": {
            "syntax": "typescript"
        },
        "target": "es2015"
    },
    "minify": false
    }
  ```
* Babel
  + 优点：
    - 编译速度快，适合大型项目。
    - 支持最新的 JavaScript 特性和插件生态。
    - 可以与其他工具（如 Webpack）无缝集成。
  + 缺点：
    - 需要额外配置才能支持 TypeScript。
    - 不支持 TypeScript 的类型检查，只负责语法转换。
* Webpack
  + 优点：
    - 支持模块打包、代码拆分、热模块替换等功能。
    - 可以与 Babel、TypeScript 等工具集成，提供完整的构建解决方案。
    - 丰富的插件和加载器生态。
  + 缺点：
    - 配置复杂，学习曲线较陡。
    - 编译速度可能较慢，尤其是在开发模式下。
* esbuild
  + 优点：
    - 编译速度极快，适合大型项目和开发环境。
    - 支持最新的 JavaScript 和 TypeScript 特性。
    - 配置简单，易于集成。
  + 缺点：
    - 生态系统相对较新，某些高级特性和插件可能不如 Webpack 完善。
    - 类型检查支持有限，通常需要与 tsc 结合使用。
* ts-node
  - 是一个 TypeScript 执行引擎，可以直接在 Node.js 中运行 TypeScript 代码，而无需手动编译。它集成了 TypeScript 编译器，并在运行时进行即时编译。
  - 安装 npm install -D ts-node
  ```bash
    ts-node src/index.ts
  ```
## tsconfig.json 中常见的参数配置
> TypeScript 允许将 tsc 的编译参数，写在配置文件 tsconfig.json。只要当前目录有这个文件，tsc就会自动读取，所以运行时可以不写参数。
见[tsconfig.json](./demo_ts/tsconfig.json)
## ts的类型系统
* 类型注解：js原始类型 number|bigint|string|boolean|undefined|null|symbol
  ```js
    const a: number = 3;
    const b: string = 3;
    const g: boolean = true;
    
    // undefined 常用于组合类型
    let j: number | undefined;
    let k: null;

    // symbol 
    let j: symbol=Symbol()

    // bigint 类型包含所有的大整数。
    // ES2020 标准引入的。如果使用这个类型，TypeScript 编译的目标 js 版本不能低于 ES2020
    const x:bigint = 123n;
    const y:bigint = 0xffffn;

    const x:bigint = 123; // 报错
    const y:bigint = 3.14; // 报错
  ```
* ts的数组类型
  > js 数组在 ts 里面分成两种类型，分别是数组（array）和元组（tuple）。
  ```ts
    // 数组的类型有两种写法。
    // 1. 是在数组成员的类型后面，加上一对方括号。
    let arr:number[] = [1, 2, 3];

    // 2. 是使用 TypeScript 内置的 Array 接口。
    let arr:Array<number> = [1, 2, 3];
    let arr:Array<number|string>;
 
    // TypeScript 允许使用方括号读取数组成员的类型。
    type Names = string[];
    type Name = Names[0]; // string

    // 只读数组
    const arr:readonly number[] = [0, 1];
    arr[1] = 2; // 报错
    arr.push(3); // 报错
    delete arr[0]; // 报错

  ```
* ts的元组类型
  > 它表示成员类型可以自由设置的数组，即数组的各个成员的类型可以不同。
  ```ts
    // 由于成员的类型可以不一样，所以元组必须明确声明每个成员的类型。
    const e: [number, string] = [1, "ww"];
   
    // 与数组写法的差异
    // 数组
    let a:number[] = [1];
    // 元组
    let t:[number] = [1];

    // 元组成员的类型可以添加问号后缀（?），表示该成员是可选的。
    let a:[number, number?] = [1];

    // 扩展运算符
    type NamedNums = [
        string,
        ...number[]
    ];

    const a:NamedNums = ['A', 1, 2];
    const b:NamedNums = ['B', 1, 2, 3];

    // 只读元组
    type t = Readonly<[number, string]>
  ```
* ts的 symbol 类型
  > Symbol 是 ES2015 新引入的一种原始类型的值。它类似于字符串，但是每一个 Symbol 值都是独一无二的，与其他任何值都不相等。
  ```ts
    // Symbol 值通过Symbol()函数生成
    let x:symbol = Symbol();
    let y:symbol = Symbol();
    x === y // false

    // unique symbol表示单个值，这个类型的变量是不能修改值的，只能用const命令声明
    const x:unique symbol = Symbol();
  ```
* ts联合类型
  ```ts
    // 联合类型  变量可以是两种类型之一
    let timer:number|null = null
    timer = setTimeout()
    // tips
    // 如果未赋值的上一个值是数字那么这个未赋值的值的是上一个值的值+1
    // 如果未赋值的上一个值未赋值那么输出的就是它的下标
    // 如果未赋值的上一个值的值是非数字,那么必须赋值
  ```
* ts的 void 类型
  ```ts
    // void 指定方法类型，表示没有返回值,方法体中不能return
    function aa(): void {
        console.log(1);
    }
  ```
* ts的枚举类型
  ```ts
    enum Color {
        Red=0,     
        Green=1,   
        Blue=2     
    }
    let c:Color = Color.Green; // 正确 推荐语义更好
    let c:number = Color.Green; // 正确
    
    // 编译后
    let Color = {
        Red: 0,
        Green: 1,
        Blue: 2
    };
    // 加上const好处:编译为 JavaScript 代码后，代码中 Enum 成员会被替换成对应的值，这样能提高性能
    const x = Color.Red;
    const y = Color.Green;
    const z = Color.Blue;
    // 编译后
    const x = 0 /* Color.Red */;
    const y = 1 /* Color.Green */;
    const z = 2 /* Color.Blue */;

    // 字符串 Enum 
    const enum Direction {
        Up = 'UP',
        Down = 'DOWN',
        Left = 'LEFT',
        Right = 'RIGHT',
    }
  ```
## ts中的工具类型
* Record
  - 快速构造对象类型，严格约束键名和值类型。
  ```ts
    // 语法
    // K：键的类型，可以是 string、number、symbol 或其联合类型
    // T：值的类型。
    // 返回值：一个对象类型，所有键来自 K，每个键对应的值为 T。
    type Record<K extends keyof any, T> = {
    [P in K]: T;
    };

    // 核心特性-严格约束键的集合
    type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
    type Schedule = Record<Weekday, string>;

    // 等价于：
    type Schedule = {
        Mon: string;
        Tue: string;
        Wed: string;
        Thu: string;
        Fri: string;
    };

    const schedule: Schedule = {
        Mon: "Work",
        Tue: "Meeting", 
        Wed: "Code",
        Thu: "Review",
        Fri: "Deploy", 
        // 缺少任一属性会报错！
    };

    // 与联合类型结合
    type Key = "id" | "timestamp";
    type Data = Record<Key, string | number>;

    const data: Data = {
        id: "abc123", 
        timestamp: 1620000000, 
    };
  ```
* Pick
  - 从现有类型中选取指定的属性，生成一个新的类型
  ```ts
    // Pick 的语法
    // T：原始类型
    // K：需要从 T 中选取的属性名的联合类型
    // 返回值：一个新类型，仅包含 T 中指定的属性 K。
    type Pick<T, K extends keyof T> = {
        [P in K]: T[P];
    };

    // 案例
    export interface CanvasConfig
      extends Pick<
        GCanvasConfig,
        | "container"
        | "devicePixelRatio"
        | "width"
        | "height"
        | "cursor"
        | "background"
      > {
        // 其他自定义属性...
    }
    // 继承 GCanvasConfig 中已有类型的属性，选取6个属性，保持属性一致，减少冗余代码
  ```
### ts的三种特殊类型
* any 类型
  - 类型表示没有任何限制，该类型的变量可以赋予任意类型的值。
  - 变量类型一旦设为any，ts 实际上会关闭这个变量的类型检查。即使有明显的类型错误，只要句法正确，都不会报错。
  + 应用场景：
    - 出于特殊原因，需要关闭某些变量的类型检查，就可以把该变量的类型设为any。
    - 为了适配以前老的 JavaScript 项目，让代码快速迁移到 TypeScript，可以把变量类型设为any
* unknown 类型
  - 为了解决any类型“污染”其他变量的问题，TypeScript 3.0 引入了unknown类型。它与any含义相同，表示类型不确定，可能是任意类型，但是它的使用有一些限制，不像any那样自由，可以视为严格版的any。
    ```ts
        // 与 any 相似之处,在于所有类型的值都可以分配给unknown类型。
        let x:unknown;

        x = true; // 正确
        x = 42; // 正确
        x = 'Hello World'; // 正确
        
        // 与 any 不同之处，它不能直接使用。主要有以下几个限制。
        // 1. unknown类型的变量，不能直接赋值给其他类型的变量（除了any类型和unknown类型）
        let v:unknown = 123;

        let v1:boolean = v; // 报错
        let v2:number = v; // 报错

        // 2.不能直接调用unknown类型变量的方法和属性。
        let v1:unknown = { foo: 123 };
        v1.foo  // 报错

        let v2:unknown = 'hello';
        v2.trim() // 报错

        let v3:unknown = (n = 0) => n + 1;
        v3() // 报错

        // 只有经过“类型缩小”，unknown类型变量才可以使用
        let a:unknown = 1;
        if (typeof a === 'number') {
            let r = a + 10; // 正确
        }
    ```
* never 类型
  > 为了保持与集合论的对应关系，以及类型运算的完整性，TypeScript 还引入了“空类型”的概念，即该类型为空，不包含任何值。
    ```ts
    // 变量x的类型是never，就不可能赋给它任何值，否则都会报错
    let x:never;

    // 一个变量可能有多种类型（即联合类型），通常需要使用分支处理每一种类型。这时，处理所有可能的类型之后，剩余的情况就属于never类型。
    function fn(x:string|number) {
        if (typeof x === 'string') {
            // ...
        } else if (typeof x === 'number') {
            // ...
        } else {
            x; // never 类型
        }
    }
    ```
  + 使用场景
    - 主要是在一些类型运算之中，保证类型运算的完整性
    - 不可能返回值的函数，返回值的类型就可以写成 never
## 函数
  ```ts
    function reload(name: string) // :string 返回值类型可省略，会自动推断出来

    // Function 类型:TypeScript 提供 Function 类型表示函数，任何函数都属于这个类型。
    function doSomething(f:Function) {
        return f(1, 2, 3);
    }
    // 箭头函数：箭头函数是普通函数的一种简化写法，它的类型写法与普通函数类似。
    const repeat = (times:number):string => console.log(times);

    // 可选参数: ? 代表这个参数可传可不传,不传就是undefined
    // 参数默认值: 设置了默认值的参数，就是可选的。如果不传入该参数，它就会等于默认值
    // 可选参数与默认值不能同时使用
    function getUserInfo(name: string, age?: number, school: string = "清华大学") {
        return `name:${name}--age:${age}--school:${school}`;
    }
    getUserInfo('qm','undefined','北京大学')   // ok
    getUserInfo('qm')            // ok

    // 参数解构: 与type 类型结合，可简化代码
    type ABC = { a:number; b:number; c:number };
    function sum({ a, b, c }:ABC) {
        console.log(a + b + c);
    }
    // rest: 参数为数组
    function joinNumbers(...nums:number[]) {}
    // rest: 参数为元组
    function f(...args:[boolean, number]) {}
    
    // 函数重载
    function reverse(str:string):string;
    function reverse(arr:any[]):any[];

  ```
## 接口
> interface 是对象的模板，可以看作是一种类型约定
  ```ts
  interface Person {
    name: string;
    age: number;
    greet(): void;
  }
  ```
## 类
* 基础示例
  ```js
    class Person {
        // 私有属性
        private name: string;
        // 构造函数
        constructor(name: string) {
            this.name = name;
        }
        
        // 获取名字
        getName(): string {
            return this.name;
        }
        
        // 设置名字
        setName(name: string): void  {
            this.name = name;
        }
    }

    let p = new Person("张三");
    p.setName("李四");
    console.log(p);

    // 抽象类不能实例化，只能继承
    // 只能被继承，内部如果有抽象方法，那么这个方法必须被子类实现
    // 可以抽离公用的逻辑
    abstract class Animal {
        private name: string;
        constructor(name: string) {
            this.name = name;
        }
        // 抽象成员--方法
        abstract eat(): any;
        // 抽象成员--属性
        protected abstract ages: Number;
        sleep(): void {
            console.log("睡觉");
        }
    }
  ```
* 访问器
  - 是一种特殊的类方法，允许将方法伪装成属性访问，同时支持动态计算值或封装内部逻辑
  ```ts
    class MyClass {
        private _value: number = 0;
        // 定义 Getter,只读
        public get value(): number {
            return this._value;
        }
    }
    const obj = new MyClass();
    console.log(obj.value); // 输出 0（看起来像访问属性，实际调用了方法）

    // Getter 通常与 Setter 配对使用，实现完整的属性访问控制
    class Temperature {
        private _celsius: number = 0;
        // Getter
        get celsius(): number {
            return this._celsius;
        }
        // Setter
        set celsius(value: number) {
            if (value < -273.15) throw new Error("温度不能低于绝对零度！");
            this._celsius = value;
        }
        // 计算属性（华氏度）
        get fahrenheit(): number {
            return this._celsius * 1.8 + 32;
        }
    }
    const temp = new Temperature();
    temp.celsius = 25; // 通过 Setter 赋值
    console.log(temp.fahrenheit); // 输出 77
  ```
## 继承
* 类继承
  + 修饰符
    - public 当前类里面，子类，类外面都可以访问,属性不加修饰符,默认就是公有的
    - protected 在当前类和子类内部可以访问，类外部无法访问
    - private 在当前类内部可访问，子类，类外部都无法访问
  + 静态属性和静态方法（static） 
    - 可以直接通过类名访问
    - 静态方法一般用作工具类方法，不需要实例化就可以调用
    - 静态属性用来存储常量
  + 类继承的示例
    ```ts
        class Son extends Person {
            // 静态属性
            public static age: number = 18;
            public school: string;

            constructor(name: string, school: string) {
                // 访问子类的构造函数中的 "this" 前，必须调用 "super",初始化父类构造函数 --并把参数传给父类
                super(name);
                // 把传进来的school赋值给全局变量
                this.school = school;
            }
            // 静态方法
            static run(name: string): string {
                return `${name}在跑步,他的年龄才${this.age}`;
            }
        }

        let son = new Son("王五", "清华大学");
        son.setName("赵六"); // 私有类也不能在子类的外部访问,但可通过公开的方法中进行赋值和访问

        console.log(Son.run("方七"));
        console.log(Son.age);
    ```
* 接口继承
  - 允许一个接口扩展其他接口，继承其成员并添加新功能
  ```ts
    interface Animal {
        name: string;
        eat(): void;
    }
    // 单个继承
    interface Dog extends Animal {
        bark(): void;
    }
    const myDog: Dog = {
        name: "Buddy",
        eat() { console.log("Eating..."); },
        bark() { console.log("Woof!"); }
    };

    // 多重继承
    interface Pet {
        owner: string;
    }
    interface Dog extends Animal, Pet {
        bark(): void;
    }
    const myDog: Dog = {
        name: "Buddy",
        owner: "Alice",
        eat() { /* ... */ },
        bark() { /* ... */ }
    };
    // 注意：
    // 1. 父接口的同名属性必须类型兼容，否则会报错
    // 2. 子接口可以重载方法，但需兼容参数和返回值
  ```
## 多态
* 概念：面向对象编程中的一个重要概念，它允许对象以多种形式出现。多态性使得同一个方法可以根据对象的不同类型而表现出不同的行为。多态主要通过继承和接口实现。
* 应用场景
  - 方法重载：同一个方法名可以有不同的参数，从而实现不同的功能。
  - 方法重写：子类可以重写父类的方法，从而实现不同的功能。
  - 接口实现：不同的类可以实现同一个接口，从而实现不同的功能。
  ```ts
    abstract class Animal {
        abstract makeSound(): void;
    }

    class Dog extends Animal {
        makeSound(): void {
            console.log("Bark");
        }
    }

    class Cat extends Animal {
        makeSound(): void {
            console.log("Meow");
        }
    }

    // 使用多态
    function makeAnimalSound(animal: Animal): void {
        animal.makeSound();
    }

    const myDog = new Dog();
    const myCat = new Cat();

    makeAnimalSound(myDog); // 输出: Bark
    makeAnimalSound(myCat); // 输出: Meow
  ```
## 泛型
> 不预先设定类型，在使用的时候确定 好处：1. 增强程序的拓展性 2. 不必写多条函数重载，联合类型声明 3. 灵活控制类型之间的约束
  ```ts
   // 泛型函数
    function identity<T>(arg: T): T {
        return arg;
    }

    let output1 = identity<string>("myString");
    let output2 = identity<number>(100);

    // 泛型接口
    interface GenericIdentityFn<T> {
        (arg: T): T;
    }

    function identityFn<T>(arg: T): T {
        return arg;
    }

    let myIdentity: GenericIdentityFn<number> = identityFn;

    // 泛型类
    class GenericNumber<T> {
        zeroValue: T;
        add: (x: T, y: T) => T;
    }

    let myGenericNumber = new GenericNumber<number>();
    myGenericNumber.zeroValue = 0;
    myGenericNumber.add = function(x, y) { return x + y; };

    // 泛型约束
    interface Lengthwise {
        length: number;
    }

    function loggingIdentity<T extends Lengthwise>(arg: T): T {
        console.log(arg.length);
        return arg;
    }

    loggingIdentity({ length: 10, value: 3 });
  ```
## 装饰器
[装饰器](https://wangdoc.com/typescript/decorator)
## declare 关键字
* declare 关键字用来告诉编译器，某个类型是存在的，可以在当前文件中使用。
  - 如自己的脚本使用外部库定义的函数，编译器会因为不知道外部函数的类型定义而报错，这时就可以在自己的脚本里面使用 declare 关键字，告诉编译器外部函数的类型。
* declare 关键字可以描述以下类型。
  - 变量（const、let、var 命令声明）
  - type 或者 interface 命令声明的类型
  - class
  - enum
  - 函数（function）
  - 模块（module）
  - 命名空间（namespace）
* declare global
  - 如果要为 js 引擎的原生对象添加属性和方法，可以使用 declare global {}语法。
  - 如为js原生的 String 对象添加了 toSmallString()方法。declare global 给出这个新增方法的类型描述。
  ```ts
    export {}; // 作用是强制编译器将这个脚本当作模块处理。这是因为 declare global 必须用在模块里面
    declare global {
        interface String {
            toSmallString(): string;
        }
    }
    String.prototype.toSmallString = ():string => {
        // 具体实现
        return '';
    };

    // 下面的示例是为 window 对象（类型接口为Window）添加一个属性myAppConfig。
    export {};
    declare global {
        interface Window {
            myAppConfig:object;
        }
    }
    const config = window.myAppConfig;
  ```
* declare module 用于类型声明文件 
  - 我们可以为每个模块脚本，定义一个.d.ts文件，把该脚本用到的类型定义都放在这个文件里面。但是，更方便的做法是为整个项目，定义一个大的.d.ts文件，在这个文件里面使用declare module定义每个模块脚本的类型。
  ```ts
    // 下面的示例是node.d.ts文件的一部分。
    declare module "url" {
        export interface Url {
            protocol?: string;
            hostname?: string;
            pathname?: string;
        }
        export function parse(
            urlStr: string,
            parseQueryString?,
            slashesDenoteHost?
        ): Url;
    }

    declare module "path" {
        export function normalize(p: string): string;
        export function join(...paths: any[]): string;
        export var sep: string;
    }
  ```
  - 另一种情况是，使用declare module命令，为模块名指定加载路径。
  ```ts
    declare module "lodash" {
        export * from "../../dependencies/lodash";
        export default from "../../dependencies/lodash";
    }
  ```
  - 使用时，自己的脚本使用三斜杠命令，加载这个类型声明文件。
  ```ts
  /// <reference path="node.d.ts"/>
  ```
## d.ts 类型声明文件
* 单独使用的模块，一般会同时提供一个单独的类型声明文件（declaration file），把本模块的外部接口的所有类型都写在这个文件里面，便于模块使用者了解接口，也便于编译器检查使用者的用法是否正确。
* 类型声明文件里面只有类型代码，没有具体的代码实现。它的文件名一般为[模块名].d.ts的形式，其中的d表示 declaration（声明）
## 类型声明文件的来源
> tsc 在编译的时候，会分别加载 lib、@types，还有 include 和 files 的文件，进行类型检查。
* ts 编译器自动生成。
  - 下面是在tsconfig.json文件里面，打开这个选项。
  ```json
    {
        "compilerOptions": {
            "declaration": true
        }
    }
  ```
* ts 内置类型文件。
  - 安装 TypeScript 语言时，会同时安装一些内置的类型声明文件，主要是内置的全局对象（JavaScript 语言接口和运行环境 API）的类型声明。
  - 这些只是声明类型，没有具体的 JS 实现，也就是 d.ts， d 是 declare 的意思
  - TypeScript 编译器会自动根据编译目标 target 的值，加载对应的内置声明文件。但是，可以使用编译选项lib，指定加载哪些内置声明文件。
  ```json
    {
        "compilerOptions": {
            "lib": ["dom", "es2021"]
        }
    }
  ```
* 外部类型声明文件  
   > 如果项目中使用了外部的某个第三方代码库，那么就需要这个库的类型声明文件。分成三种情况。
  1. 这个库自带了类型声明文件。
  2. 这个库没有自带，但是可以找到社区制作的类型声明文件。这些声明文件都会作为一个单独的库，发布到 npm 的 @types 名称空间之下
  3. 找不到类型声明文件，需要自己写,或 使用 any