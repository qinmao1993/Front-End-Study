# js 中的类(class)
## 定义类
  ```js
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        toString() {
            return '(' + this.x + ', ' + this.y + ')';
        }
    }
    // 表达式形式的类
    const MyClass = class Me {
      getClassName() {
        return Me.name; // name 属性总是返回紧跟在 class 关键字后面的类名。
    }

    const inst = new MyClass();
    inst.getClassName() // Me 
    Me.name // ReferenceError: Me is not defined

    // 这个类的名字是 MyClass 而不是 Me，Me只在 Class 的内部代码可用，指代当前类。
    // 类的内部没用到的话，可以省略Me
    };
  ```
## 私有方法、私有属性
   ```js
    // 原生支持
    class myClass{
        #abc; // 定义一个私有字段
        constructor() {
           this.#abc=1
        }
        // 定义一个私有的方法
        #method(){

        }
    };
        const a=new myClass()
        console.log(a.#abc) // 访问不到
  ```
## 实例成员和静态成员
 - 静态方法加 static 指向类本身而非实例
  ```js
    class Rabbit(){
      static total=0
       constructor(x, y) {
            this.x = x;
            this.y = y;
            Rabbit.total++
        }
    }
    // 和实例成员的差别：1、 语义上的 2、内存结构上的
    const rab=new Rabbit()
    console.log(Rabbit.total ) // 0

  ```
## 类继承
 > JS 中并不存在类，class 只是语法糖，本质还是函数。
  > 以下可证明
  ```js
      class Person {}
      Person instanceof Function // true

      class Parent {
        constructor(value) {
          this.val = value
        }
        getValue() {
            console.log(this.val)
        }
      }

      class Child extends Parent {
        constructor(value) {
            super(value) // 可以看成 Parent.call(this, value)
        }
      }
      const child = new Child(1)
      child.getValue() // 1
      child instanceof Parent // true

    // super
    class Point {}
    class ColorPoint extends Point {}
    // 由于没有部署任何代码，所以这两个类完全一样，等于复制了一个Point类

    class ColorPoint extends Point {
        constructor(x, y, color) {
            super(x, y); // 调用父类的 constructor(x, y)
            this.color = color;
        }
        toString() {
            return this.color + ' ' + super.toString(); // 调用父类的toString()
        }
        // super 它在这里表示父类的构造函数，用来新建父类的 this 对象

        // 注意：子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错。这是因为子类没有自己的 this 对象，而是继承父类的 this 对象，然后对其进行加工。如果不调用super方法，子类就得不到this对象
    }
    // es5 与 es6 继承的区别:
    // es5 是先创造子类的实例对象 this，然后再将父类的方法添加到 this 上面（Parent.apply(this)）
    // es6 实质是先创造父类的实例对象 this（所以必须先调用super方法），然后再用子类的构造函数修改 this。
  ``` 