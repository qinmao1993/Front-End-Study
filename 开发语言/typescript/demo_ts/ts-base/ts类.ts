// 普通类
class Person {
  // 私有属性
  private name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log(
      `Hello, my name is ${this.name} and I am ${this.age} years old.`
    );
  }
}

const person = new Person("John Doe", 30);
person.greet();

// 抽象类:可以抽离公用的逻辑
// 1. 抽象类不能实例化，只能被继承
// 2. 抽象类可以包含抽象方法和抽象属性, 抽象方法不包含具体实现，必须在派生类中实现
abstract class Animal1 {
  // 抽象成员--方法
  abstract eat(): void;
  // 抽象成员--属性
  protected abstract ages: Number;
}

class Dog1 extends Animal1 {
  protected ages: Number;
  eat(): void {
    console.log("eat");
  }
}

const dog = new Dog1();
dog.eat();
