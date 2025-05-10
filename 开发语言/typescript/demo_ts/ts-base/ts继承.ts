// tips:
// public 在当前类里面，子类，类外面都可以访问,属性不加修饰符,默认就是公有的 (public)
// protected 在当前类和子类内部可以访问，类外部无法访问
// private 在当前类内部可访问，子类，类外部都无法访问。

class Person {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }
}

// 静态属性和静态方法可以直接通过类名访问
// 应用场景：
// 1. 静态方法工具类方法，不需要实例化就可以调用
// 2. 静态属性用来存储常量
class Son extends Person {
  // 静态属性
  public static age: number = 18;
  public school: string;
  constructor(name: string, school: string) {
    // 访问派生类的构造函数中的 "this" 前，必须调用 "super",初始化父类构造函数 --并把参数传给父类
    super(name);
    //把传进来的school赋值给全局变量
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
