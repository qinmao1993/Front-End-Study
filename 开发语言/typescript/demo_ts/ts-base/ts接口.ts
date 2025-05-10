// Define an interface
interface Person {
  name: string;
  age: number;
  greet(): void;
}

// Implement the interface in a class
class Student implements Person {
  name: string;
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

// Create an instance of the class
const student = new Student("John Doe", 20);
student.greet(); // Output: Hello, my name is John Doe and I am 20 years old.
