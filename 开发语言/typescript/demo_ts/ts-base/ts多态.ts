// 概念：面向对象编程中的一个重要概念，它允许对象以多种形式出现。多态性使得同一个方法可以根据对象的不同类型而表现出不同的行为。多态主要通过继承和接口实现。
// 应用场景
//   1. 方法重载：同一个方法名可以有不同的参数，从而实现不同的功能。
//   2. 方法重写：子类可以重写父类的方法，从而实现不同的功能。
//   3. 接口实现：不同的类可以实现同一个接口，从而实现不同的功能。

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
