# js 基础

## es的标准
* ES6 / ES2015
* ES7 / ES2016
* ES8 / ES2017
* ES9 / ES2018
* ES10 / ES2019
* ES11 / ES2020
* ES12 / ES2021

## 原始数据类型
* 7种原始类型（原始类型存储的都是值，是没有函数可以调用）
  + Boolean
  + Null:空指针类型  没有指向任何一个对象
  + Undefined:声明变量后不赋值
  + Number
    - NaN 是 number 型 表示不是一个数字
      ```js
        var a=123;
        var b="abc";
        console.log(typeof(a-b)) // NaN  number
      ```
    - infinity(-infinity)表示无穷大 除数为0可得 infinity,-0 得到 -infinity
    + 非整数的运算存在的精度问题？
      ```js
        // 小数运算不精确的根源主要在于计算机内部表示数字的方式以及浮点数的存储格式
        console.log( 0.1 + 0.2 == 0.3); // 0.30000000000000004 false
        console.log( 0.1 + 0.2 === 0.3); // false
        // 检查等式左右两边差的绝对值是否小于最小精度，才是正确的比较
        console.log(Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON);true
        // 解决方案：
        // 由于整数不存在精度问题,所以推荐先换算成整数参与运算。最后除以倍数
      ```
  + String
    - 字符串添加了遍历器接口(es6)
    ```js
    // 字符串可以被for...of循环遍历。
    for (let codePoint of 'foo') {
        console.log(codePoint)
    }
    ```
    - 模板字符串(es6)
    ```js
        // 普通字符串
        `In JavaScript '\n' is a line-feed.`
        // 多行字符串
        `In JavaScript this is
        not legal.`
        console.log(`string text line 1
        string text line 2`);
        // 字符串中嵌入变量
        var name = "Bob", time = "today";
        `Hello ${name}, how are you ${time}?`
    ```
  + Symbol
  + BigInt(新增的数字类型): 表示用任意精度表示整数
* 类型检测几种方案
  + typeof
    - 对于原始类型来说，除了 null 都可以显示正确的类型
    - 对于对象来说，除了函数都会显示 object，所以说 typeof 并不能准确判断变量到底是什么型
  + instanceof
    - 内部机制是通过原型链中是不是能找到该类型的 prototype。
    - 一般来判断对象，不能直接用来判断原始类型
      ```js
        var arr=[];
        Array.isArray(arr) // 有兼容性问题
        arr instanceof Array // 推荐使用
      ```
  + 判断特定类型的api
    ```js
        Array.isArray([])
        // true
        Number.isNaN(',')
        // true
    ```
  + 可检测任意类型：
    - Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
* 类型转换
  + 隐式转换 变量在运算过程中发生的类型转换
    - console.log(!!"abc")
  + 显示（强制）转换:
    - 转字符串: number 转 string ''+number
    - 转数字型：parseInt、 parseFloat、Number(str)
    - 转布尔:几种转换为 false, undefined NaN Null 0 -0 false "",其余全为 true
    > tip:使用 parseInt(a,10)，否则会遇到0开头的八进制的问题，parseInt() 是解析而不简单的转换,简单的类型转换 Number(08)=8 会比 parseInt 快
* 隐式类型转换
  + 如果对比双方的类型不一样的话，就会进行类型转换(判断流程如下)
    1. 首先会判断两者类型是否相同。相同的话就是比大小了
    2. 类型不相同的话，那么就会进行类型转换
    3. 会先判断是否在对比 null 和 undefined，是的话就会返回 true
    4. 判断两者类型是否为 string 和 number，是的话就会将字符串转换为 number
    5. 判断其中一方是否为 boolean，是的话就会把 boolean 转为 number 再进行判断
    6. 判断其中一方是否为 object 且另一方为 string、number 或者 symbol，是的话就会把 object 转为原始类型再进行判断，对象转换成基础类型，利用它的toString或者valueOf方法   
    ```js
     []==![] // true
        1. 看见 ![ ]这个是要对空数组转成布尔类型结果得到![ ] = false,
        2. 发现此时符合第5条，即Number(false),结果为 Number(false) = 0。
        3. 此时得到 [] == 0比较，此时符合第6条 即 [].toString()；结果为[].toString() = ” ”;
        4. 此时得到 ” ” == 0,发现符合第4条即Number(“ ”)；结果为Number(” ”) = 0;
        5. 此时得到 0 == 0 两个同时为数值类型比较所以结果为true;   
     [] == false // true
        1. false -->Number(false),结果为 Number(false) = 0。
        2. []== 0-->[].toString() 结果为[].toString() = ” ”;
        3. ' '==0-->Number(' ') = 0;
        4. 0==0 true
    ```
* 进制转换
  > js 主要通过 parseInt() 和 toString() 方法实现进制转换
  + 其他进制转十进制
    - 使用 parseInt(string, radix) string: 要解析的字符串,radix: 进制基数（2-36）
    ```js
        // 二进制转十进制
        parseInt('1010', 2);    // 返回 10

        // 八进制转十进制
        parseInt('12', 8);      // 返回 10

        // 十六进制转十进制
        parseInt('A', 16);      // 返回 10
    ```
  + 十进制转其他进制
    - 使用 number.toString(radix) 方法：radix: 目标进制基数（2-36）
    ```js
        // 十进制转二进制
        (10).toString(2);       // 返回 "1010"

        // 十进制转八进制
        (10).toString(8);       // 返回 "12"

        // 十进制转十六进制
        (10).toString(16);      // 返回 "a"
    ```
  + 任意进制之间的转换
    - 通过十进制作为中间桥梁进行转换：
    ```js
        function convertBase(number, fromBase, toBase) {
            // 先转换为十进制，再转换为目标进制
            let decimal = parseInt(number, fromBase);
            return decimal.toString(toBase);
        }

        // 二进制转十六进制
        convertBase('1010', 2, 16);  // 返回 "a"

        // 八进制转二进制
        convertBase('12', 8, 2);     // 返回 "1010"
    ```
    

## 引用类型-数组
* 定义：用于存储有序数据集合
* 数组的创建
  1. 字面量创建
    ```js
      const arr = [1, 'a', { name: 'Alice' }, [2, 3]];
    ```
  2. 构造函数创建
   ```js
    const arr = new Array(3);      // 创建长度为3的空数组 [empty ×3]
    const arr2 = new Array(1, 2);  // [1, 2]
   ```
  3. ES6+ 新增方法
    ```js
      Array.from('abc');       // ['a', 'b', 'c']（类数组转数组）
      Array.of(1, 2, 3);       // [1, 2, 3]（解决 new Array(3) 的歧义）
    ```
* 常见的用法
  ```js
    // 快速去重
    const uniqueArr = [...new Set([1, 2, 2, 3])]; // [1, 2, 3]

    // 清空数组
    arr.length = 0;    // 推荐方式（直接修改原数组）

    // 浅拷贝数组
    const copy = [...arr];       // ES6扩展运算符
    const copy2 = arr.slice();   // slice() 无参数

    // 多维数组扁平化
    const deepArr = [1, [2, [3]]];
    deepArr.flat(Infinity);      // [1, 2, 3]

    // 交换元素位置
    [arr[i], arr[j]] = [arr[j], arr[i]]; // 解构赋值
  ```

## 引用类型-函数    
* arguments 参数
  - 伪数组对象,存储实参
    ```js
        // 1.
        function b(x,y,z){
            arguments[2]=10
            alert(z) // 10
        }
        b(1,2,3) 

        // 2. 
        function b(x,y,z){
            z=10
            alert(arguments[2]) // 10 
        }
        b(1,2,3)
    ```
* rest参数（es6）
  ```js
    function add(...values) {
        let sum = 0;
        for (let val of values) {
            sum += val;
        }
        return sum;
    }
    add(2, 5, 3) // 10
  ```
* 函数参数的默认值(es6)
  ```js
    // es6 之前使用短路或操作给参数赋初值
    function log(x, y = 'World') {
        console.log(x, y);
    }
  ```
* 扩展运算符(...) (es6)
* 沙箱模式：
  - 防止全局变量和全局对象的污染，引出沙箱模式,实质就是匿名的自执行函数
    ```js
      (function(global){
        // 代码块
        // 自执行

        // 在内部声明的变量与外部隔离
        // 把常用的全局变量，当做实参传入进来
        // 目的：1. 减少变量的搜索过程，提高js 性能
        //      2. 利于代码压缩
      }(window));
      // 一般开发插件时会用，如 jq 插件
    ```
* 箭头函数(es6)
  ```js
    var sum = (num1, num2) => num1 + num2;
    var sum = (num1, num2) => { return num1 + num2; }
    // 注意 this指向 不需要在函数外捕获 this
  ```

## 引用类型-对象
* 如何创建对象？
  - 字面量:var obj={};
  - 构造函数创建对象
    ```js
      function Student(name, age, sex) {
          this.name = name
          this.age = age
          this.sex = sex
          this.sayHi = function () {
              console.log("你好" + this.name)
          }
      var s1 = new Student("小明", "12", "男");
    ```
  - 工厂模式创建对象 就是用一个方法实现对象的实例化
    ```js
       function initStu(name, age,sex) {
            return new Student(name, age,sex);
          }
       var obj=initStu();
      // 这种方式创建对象避免new的操作    
    ``` 
* 对象的属性
  + 两种访问方式：
    - obj.propertyName  底层调用 get
    - obj["propertyName"] 遍历属性并赋值时常用到 底层调用get区别在于 会判断propertyName是不是 symbol,是返回，否转成 String
  + hasOwnProperty
    - 语法：<对象>.hasOwnProperty('propertyName')
    - 功能：用来判断指定的属性是否为该对象自己拥有的，而不是继承下来的。
  + Object.hasOwn 比“obj.hasOwnProperty”方法更加方便、安全
    ```js
        let obj = { age: 24 }
        Object.hasOwn(obj, 'age') // true

        let object2 = Object.create({ age: 24 })
        Object.hasOwn(object2, 'age') // false  

        let object3 = Object.create(null)
        Object.hasOwn(object3, 'age') // false 
    ```
  + 属性的简洁表示法(es6)
    ```js
        var foo = 'bar';
        var baz = {foo};
        // 等同于
        var baz = {foo: foo};

        // 方法的简写
        var o = {
            method() {
                return "Hello!";
            }
        };
        // 模块简写
        module.exports = { getItem, setItem, clear };
        // 等同于
        module.exports = {
            getItem: getItem,
            setItem: setItem,
            clear: clear
        };
    ```
* 对象属性非空的判断
  > 开发中经常会遇到 cannot read properties of undefined 这种报错，因此对数据访问时的非空判断就变成了一件很繁琐且重要的事情。ECMAScript 2020 出了新语法方便我们开发
  + 可选链操作符(?)：
    - 允许您在访问对象属性或调用函数时，检查中间的属性是否存在或为 null/undefined。如果中间的属性不存在或为空，表达式将短路返回 undefined，而不会引发错误
    ```js
        const obj = {
            foo: {
                bar: {
                    baz: 42
                }
            },
            xyz: []
        };
        // 使用可选链操作符
        // 如果任何中间属性不存在或为空，value 将为 undefined
        const value1 = obj?.foo?.bar?.baz; 

        // 除了对属性的检查，还可以用于对数组下标及函数的检查
        const value2 = obj?.xyz?.[0]?.fn?.();
        
        // 传统写法 需要手动检查每个属性
        const value1 = obj && obj.foo && obj.foo.bar && obj.foo.bar.baz; 
        const value2 = obj && obj.xyz && obj.xyz[0] && obj.xyz[0].fn && obj.xyz[0].fn();

    ```
  + 空值合并操作符(??)
    - 用于选择性地提供默认值，仅当变量的值为 null 或 undefined 时，才返回提供的默认值。否则，它将返回变量的实际值。
    ```js
        // 案例
        const foo = null;
        const bar = undefined;

        const baz = 0;
        const xyz = false;
        const qux = '';

        const value1 = foo ?? 'default'; // 'default'
        const value2 = bar ?? 'default'; // 'default'
        const value3 = baz ?? 'default'; // 0，因为 baz 
        const value4 = qux ?? 'default'; // ''，因为 qux 
        const value5 = xyz ?? 'default'; // false，因为 xyz 

        // 可能存在的传统写法，除了 null,undefined无法兼容 0、''、false 的情况,使用时要特别小心
        const value1 = foo || 'default'; // 'default'
        const value2 = bar || 'default'; // 'default'
        
        const value3 = baz || 'default'; // 'default'，因为 0 转布尔类型是 false
        const value4 = qux || 'default'; // 'default'，因为 '' 转布尔类型是 false
        const value5 = xyz || 'default'; // 'default'
    ```

## 条件判断与分支循环
* 短路操作
  + 执行过程(当操作数不是bool值时)
    1. 隐式转换
    2. 从左往右
    3. 哪个操作数可以决定结果，就返回这个原操作数
  + 短路与（&&）
    - 只要有一个false，就返回 该值false的子表达式的值
    - 短路与：可以保证某个变量有值，在参与运算
    - eg: Object.create&&Object.create(obj)
  + 短路或（||）
    - 只要有一个true，就返回 该 值true的子表达式的值
    - 短路或：可以方便给变量赋初值 
* break|continue 
  - break 跳出循环，执行循环之后的代码
  - continue 中断（循环中）的一个迭代，然后继续循环中的下一个迭代
  ```js
    for (let i = 0; i < 10; i++) {
        console.log(i);
        if (i === 5) {
            console.log("条件满足，跳出循环！");
            break;  // 当 i 等于 5 时，跳出循环
        }
    }
    console.log("循环结束");

    for (let i = 0; i < 10; i++) {
        if (i === 5) {
            console.log("跳过 i = 5");
            continue;  // 当 i 等于 5 时，跳过当前迭代，继续下一个循环
        }
        console.log(i);  // 仅当 i 不等于 5 时才会打印
    }
    console.log("循环结束");

  ```
* 循环转递归公式
  ```js
   function demo1(){
    // 前面的内容
    for(初始代码；条件；后置代码){
        // 循环体
    }
    // 后面的代码
   }
   function demo2(){
        // 前面的内容
      初始代码
      function _m(){
        if(!条件){
            return
        }
        // 循环体
        后置代码
        _m()
      }
      _m()
      // 后面的代码
   }
  ```

## js执行机制
* 什么叫作用域：
  - 指在程序中定义变量的区域，该位置决定了变量的生命周期。作用域就是变量与函数的可访问范围
  - ES6之前只有2种作用域：全局和函数作用域，全局代码中任意位置都可以访问，函数只能在内部被访问，执行完销毁
* 作用域链
  - 示例引出
    ```js
        function bar() {
            console.log(myName)
        }
        function foo() {
            var myName = "极客邦"
            bar()
        }
        var myName = "极客时间"
        foo()
    ```
  - 词法作用域：函数声明的位置来决定的，由代码编译阶段就决定好的，和函数是怎么调用的没有关系。
  - 作用域链：通过作用域查找变量的链条称为作用域链。作用域链是由词法作用域决定的
  - 变量查找的过程：先在当前的执行上下文中查找，没有就去外部引用的执行上下文查找
* 变量提升：js代码是按顺序执行的吗？
  + js预解析阶段
    - 语法分析：保证js代码符合语法规则，能被正确的执行。
    - 变量名以及函数名提升
    - 确定变量的作用域。
    > 先扫描整个函数体的语句，把所有申明的变量“提升”到函数顶部
    ```js
        function foo() {
            var x = 'Hello, ' + y;
            alert(x);
            var y = 'Bob';
        }
        foo();
        // 变量提升后代码：
        function foo() {
            var y; // 提升变量y的申明
            var x = 'Hello, ' + y;
            alert(x);
            y = 'Bob';
        }   
        // hello undefined  
        // 函数内变量的怪异声明模式:
        function fun(){
            num=10   // 没写var 就相当于全局变量
        }
        fun()
        console.log(num) //10
    ```
* 变量提升带来的问题：
  - 变量容易在不被察觉的情况下被覆盖掉
  - 本应销毁的变量没有被销毁
    ```js
      function foo(){
        for (var i = 0; i < 7; i++) {}
        console.log(i); 
        // 如果你使用 C 语言或者其他的大部分语言实现类似代码，在 for 循环结束之后，i 就已经被销毁了，但是在 js 代码中，i 的值并未被销毁，所以最后打印出来的是 7
        // 为了解决这些问题，ES6 引入了 let 和 const 关键字，从而使 JavaScript 也能像其他语言一样拥有了块级作用域
      }
      foo()
    ```
* var|let|const 区别 
   - var 在浏览器预解析时存在变量提升，未声明可以使用
   - let 不存在变量提升,未声明就使用，会报错（暂时性死区),只在代码块内有效
   - const 声明一个只读的常量。一旦声明常量的值就不能改变。
    (对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const 只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了)
   - 综合示例考察
    ```js
        for (var index = 0; index < 10; index++) {
                setTimeout(() => {
                    console.log(index)
                },0); 
        }
        // 涉及到 js 执行机制 执行栈同步执行完，把异步队列拿到栈执行10次 
        // 输出10次10 

        // 依次输出 0 到 9
        for (let index = 0; index < 10; index++) {
            setTimeout(function(){
                console.log(index);
            },0);
        }

        // 块级作用域
        // 输出的结果 0一直到9，也可以用闭包来实现
        for (var index = 0; index < 10; index++) {
            (function(index){
                setTimeout(fucntion(){
                    console.log(index)
                },0 );
            })(index);
        }

    ```
* 调用栈
  + 执行上下文：当一段代码被执行时，js引擎先会对其进行编译，并创建执行上下文
    - 当js执行全局代码的时候，会编译全局代码并创建全局执行上下文，而且在整个页面的生存周期内，全局执行上下文只有一份。
    - 当调用一个函数的时候，函数体内的代码会被编译，并创建函数执行上下文，一般情况下，函数执行结束之后，创建的函数执行上下文会被销毁。
    - 当使用 eval 函数的时候，eval 的代码也会被编译，并创建执行上下文。
  + 什么是调用栈
    - 栈结构：特点是后进先出
    - 调用栈就是用来管理函数调用关系的一种栈结构
    - js 引擎追踪函数执行的一个机制
    - 开发中的使用：在浏览器soucre中打上一个断点，当执行该函数时，通过 call stack 查看当前调用栈的情况 anonymous 是全局的函数入口 或者通过 console.trace() 打印出当前函数的调用关系
  + 为什么会出现栈溢出的问题
    - 调用栈是有大小的，当入栈的执行上下文超过了，js 引擎就会报栈溢出的错误
    - 使用递归不当会导致该问题，所以要明确终止条件
* this 指向问题（执行上下文的视角）
  + 执行上下文：
    - 包含变量环境、词法环境、outer(外部环境)、this(和执行上下文是绑定的，每个执行上下文都有个this)
    - 分为：全局执行上下文、函数..、eval..三种，对应的this也有三种
  + 全局执行上下文 this 指向为 window
  + 函数执行上下文
    1. call|apply|bind
       - fn.call(thisObj, [arg1~argN])
       - fn.apply(thisObj, [数组]);
       - bind 方法创建一个新的函数, 当被调用时，将其 this 执行第一个参数  
       > fun.bind(thisArg[, arg1[, arg2[, ...]]])
       > 返回值：返回由指定的this值和初始化参数改造的原函数拷贝
    2. 通过对象调用方法设置
       - 将一个函数 赋值给 某个对象的属性，然后通过该对象去执行函数,该方法的 this 是指向对象本身
       ```js
        var myObj = {
            name : "极客时间", 
            showThis: function(){
                console.log(this)
            }
        }
        myObj.showThis()
       ```
    3. 构造函数模式
       - 函数内部的 this 指向为 当前创建出来的实例。
       - 构造函数的执行过程
         1. 创建一个空对象obj
         2. 将上面的创建的空对象obj赋值给this
         3. 执行代码块（给属性赋值等等）
         4. 隐式返回 return this   
    4. 箭头函数
       - 函数并不会创建其自身的执行上下文
       - 箭头函数中的 this 只取决包裹箭头函数的第一个普通函数的 this
* 闭包
  - 写法示例：
    ```js
        function foo() {
            var myName = "极客时间"
            let test1 = 1
            var innerBar = {
                getName(){
                    console.log(test1)
                    return myName
                },
                setName(newName){
                    myName = newName
                }
            }
            return innerBar
        }
        var bar = foo()
        bar.setName("极客邦")
        bar.getName()
        console.log(bar.getName())
        
        
        var bar = {
            myName:"time.geekbang.com",
            printName: function () {
                console.log(myName)
            }    
        }
        function foo() {
            let myName = "极客时间"
            return bar.printName
        }
        let myName = "极客邦"
        let _printName = foo()
        _printName()
        bar.printName()
    ```
  - 定义：根据词法作用域的规则，内部函数总是可以访问其外部函数中声明的变量，当通过调用一个外部函数返回一个内部函数后，即使该外部函数已经执行结束了，但是内部函数引用外部函数的变量依然保存在内存中。
  + 闭包使用中的问题：
    - 本质上就是让数据常驻内存。如此，使用闭包就增大内存开销，使用不当就会造成GC无法回收，导致内存泄漏。
    - 应用场景：1. 保护私有变量 2. 维持内部私有变量的状态
    - 如何解决：
      1. 如果该闭包会一直使用，那么它可以作为全局变量而存在；但如果使用频率不高，而且占用内存又比较大的话，那就尽量让它成为一个局部变量。
      2. 使用完闭包后，及时清除。（将闭包变量 赋值为 null）

## setTimeout|setInterval
* js中的计时器能否精确计时？为什么
  - 硬件: 层面不可能
  - 系统：操作系统的计时
  - 标准w3c：>=5的嵌套层级，最小4ms
  - 事件循环:回调函数执行时，必须等待调用栈执行完毕
  
## globalThis
* 是 js 中的一个全局对象，它提供了一种标准化的方式来访问不同运行环境中的全局作用域
* 在不同的 JavaScript 运行环境中，全局对象的名称是不同的：
  - 在浏览器中，全局对象是 window
  - 在 Node.js 中，全局对象是 global
  - 在 Web Workers 中，全局对象是 self。

## js异常
> js中所有的异常都是Error的实例，可通过构造函数，自定义一个异常对象
* EvalError  运行时异常。 eval 函数调用时发生的异常
* RangeError 运行时异常 超出数据范围
* ReferenceError 运行时异常 未定义变量
* SyntanxError  预解析,语法错误
* typeError 运行时异常，类型异常
* URIError 运行时异常 在执行 encodeURI 和 decodeURI 时抛出的常