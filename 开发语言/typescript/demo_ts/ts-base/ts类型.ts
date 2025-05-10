// 1. 类型注解 (Type Annotations)
let user: string = "Alice";

// 2. 基本类型:string、number、boolean、null、undefined
let isActive: boolean = true;
let userName: string = "Alice";
let count: number | undefined = 10; // undefined 常用于组合类型
let k: null;
let j: symbol = Symbol();

// ES2020 标准引入的。如果使用这个类型，TypeScript 编译的目标 js 版本不能低于 ES2020
const x: bigint = 123n;
const y: bigint = 0xffffn;
//  const x:bigint = 123; // 报错
//  const y:bigint = 3.14; // 报错

// 3. 数组类型:通过 [] 或 Array<type> 来声明数组类型。
let numbers: number[] = [1, 2, 3];
let strings: Array<string | number> = ["apple", "banana", "1", 2];
// 只读数组
const arr: readonly number[] = [0, 1];
// arr[1] = 2; // 报错
// arr.push(3); // 报错
// delete arr[0]; // 报错

// 4. 元组 (Tuple):是具有固定数量和已知类型的数组。
let tuple: [string, number] = ["Alice", 25];

// 5. 枚举 (Enum):枚举是一种用户定义的类型，可以通过枚举名称访问枚举成员。
enum Color {
  Red,
  // Red = 1,
  Green,
  // Green = 2,
  Blue,
  // Blue = 3,
}
let c: Color = Color.Green; // 默认是从 0 开始的，也可以手动赋值，比如 Red = 1，Green = 2，Blue = 3

// 6. Any 类型:可以用来表示任意类型。
//一般来说，应该尽量避免使用 any，因为它会丧失类型安全。
let notSure: any = 4;
notSure = "maybe a string instead";

// 7.Void 和 Never 类型
// void 类型常用于函数返回值，表示函数不返回任何值。
// never 类型表示一个永远不会成功完成的函数，如抛出异常的函数。
function logMessage(message: string): void {
  console.log(message);
}
function throwError(message: string): never {
  throw new Error(message);
}

// 8.函数类型
function add(a: number, b: number): number {
  return a + b;
}

// 9. 接口 (Interfaces):TypeScript 的核心概念之一，它定义了对象的结构和规范。
interface Person {
  name: string;
  age: number;
}
const person: Person = { name: "Alice", age: 30 };

// 10. 类 (Classes)
// TypeScript 扩展了 JavaScript 的类（class）和继承（extends）功能
// 支持类型注解和访问修饰符（如 public、private、protected）。
class Animal {
  constructor(public name: string) {}

  makeSound() {
    console.log("Animal sound");
  }
}
class Dog extends Animal {
  makeSound() {
    console.log("Woof!");
  }
}

// 11. 类型别名 (Type Aliases):类型别名允许你为任何类型定义一个新的名称。
type ID = string | number;

let userId: ID = "1234";
userId = 5678;

// 12. 联合类型 (Union Types):表示一个值可以是多个类型中的任意一个。
function printId(id: string | number): void {
  console.log(id);
}

// 13. 泛型 (Generics)
// 泛型允许在定义函数、接口或类时使用类型变量，使得代码更具可复用性。
function identity<T>(arg: T): T {
  return arg;
}
let output = identity<string>("Hello, World!");

// 15. 类型推断 (Type Inference)
// TypeScript 会根据变量的初始值或函数返回值自动推断类型。大部分情况下，TypeScript 可以通过代码推断出类型，无需显式声明。
let greeting = "Hello, World!";  // TypeScript 会推断 greeting 类型为 string


