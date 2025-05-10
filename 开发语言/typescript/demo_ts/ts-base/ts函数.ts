// 1. :string 返回值类型可省略，会自动推断出来
function test(name: string) {
  return `hello ${name}`;
}

// 2. 函数参数:
// 2.1 Function
function test2(callback: Function) {
  callback("hello");
}

// 2.2 可选参数
// 可选参数: ? 代表这个参数可传可不传,不传就是 undefined
// 参数默认值: 设置了默认值的参数，就是可选的。如果不传入该参数，它就会等于默认值
// 可选参数与默认值不能同时使用
function test3(name: string, age?: number, school: string = "清华大学") {
  return `name:${name}--age:${age}--school:${school}`;
}
test3("qm", undefined, "北京大学"); // ok
test3("qm"); // ok

// 2.3 剩余参数 rest
// 剩余参数语法允许我们将一个不定数量的参数表示为一个数组
function test4(name: string, ...args: any[]) {
  console.log(args); // rest参数是一个数组
}
function test5(name: string, ...args: [boolean, number]) {
  console.log(args); // rest参数是一个元组
}

// 2.4 参数结构
// 参数解构: 与type 类型结合，可简化代码
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}

// 3. 函数重载
// 函数重载: 为同一个函数提供多个函数类型定义

// 定义函数重载签名
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: number, b: string): string;
function add(a: string, b: number): string;

// 实现函数
function add(a: any, b: any): any {
  if (typeof a === "number" && typeof b === "number") {
    return a + b;
  } else if (typeof a === "string" && typeof b === "string") {
    return a + b;
  } else if (typeof a === "number" && typeof b === "string") {
    return a + b;
  } else if (typeof a === "string" && typeof b === "number") {
    return a + b;
  }
}

// 使用函数重载
console.log(add(1, 2)); // 输出: 3
console.log(add("Hello, ", "World!")); // 输出: Hello, World!
console.log(add(1, " World!")); // 输出: 1 World!
console.log(add("Hello, ", 2)); // 输出: Hello, 2
