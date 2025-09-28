# Class(ES6的类)

## 介绍
* JS 中并不存在类，class 只是语法糖，本质还是函数。它提供了更清晰、更面向对象的语法来创建对象和处理继承。
* 验证
  ```js
    class Person {}
    Person instanceof Function // true
  ```

## 类声明
  ```js
    class Person {
        // 私有字段和方法 (ES2022) (以#开头)
        #balance;
        // 构造函数 
        constructor(name, age,balance=0) {
            // 实例属性
            this.name = name;
            this.age = age;

            this.#balance = balance;
        }

        // 实例方法
        introduce() {
            return `你好，我是${this.name}，今年${this.age}岁`;
        }
        // 静态属性和方法：指向类本身而非实例
        static version = '1.0.0';
        static species() {
            return '人类';
        }

        #validate(balance) {
            return balance>=0
        }

        // Getter 和 Setter
        get balance() {
            console.log(`查询余额: ${this.#balance}`);
            return this.#balance;
        }
        set balance(amount) {
            if (amount < 0) {
                throw new Error('余额不能为负数');
            }
            const oldBalance = this.#balance;
            this.#balance = amount;
            console.log(`设置余额: ${oldBalance} -> ${amount}`);
        }
    }
    // 使用类
    const person = new Person('张三', 25,1000);
    console.log(person.introduce()); // 你好，我是张三，今年25岁
    console.log(Person.species(),Person.version); // 人类 1.0.0
    console.log(person.#balance); //  错误: 私有字段不可访问


    // 类表达式
    const Animal = class {
        constructor(name) {
            this.name = name;
        }
        speak() {
            return `${this.name} 发出声音`;
        }
    };
    const dog = new Animal('狗狗');
  ```

## 实际应用案例
  ```js
    // 完整的购物车系统
    class ShoppingCart {
        constructor() {
            this.items = [];
            this.discount = 0;
        }
        addItem(product, quantity = 1) {
            const existingItem = this.items.find(item => item.product.id === product.id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.items.push({
                    product,
                    quantity,
                    addedAt: new Date()
                });
            }
            return this;
        }
        removeItem(productId, quantity = 1) {
            const itemIndex = this.items.findIndex(item => item.product.id === productId);
            if (itemIndex !== -1) {
                if (this.items[itemIndex].quantity <= quantity) {
                    this.items.splice(itemIndex, 1);
                } else {
                    this.items[itemIndex].quantity -= quantity;
                }
            }
            return this;
        }
        applyDiscount(percentage) {
            this.discount = Math.min(100, Math.max(0, percentage));
            return this;
        }
        get subtotal() {
            return this.items.reduce((total, item) => {
                return total + (item.product.price * item.quantity);
            }, 0);
        }
        get total() {
            const subtotal = this.subtotal;
            const discountAmount = subtotal * (this.discount / 100);
            return subtotal - discountAmount;
        }
        get itemCount() {
            return this.items.reduce((count, item) => count + item.quantity, 0);
        }
        clear() {
            this.items = [];
            this.discount = 0;
            return this;
        }
        checkout() {
            const receipt = {
                items: this.items.map(item => ({
                    product: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                    total: item.product.price * item.quantity
                })),
                subtotal: this.subtotal,
                discount: this.discount,
                total: this.total,
                checkoutTime: new Date()
            };
            this.clear();
            return receipt;
        }
    }

    // 使用示例
    class Product {
        constructor(id, name, price) {
            this.id = id;
            this.name = name;
            this.price = price;
        }
    }
    const cart = new ShoppingCart();
    const product1 = new Product(1, '笔记本电脑', 5000);
    const product2 = new Product(2, '鼠标', 100);

    cart.addItem(product1, 1)
        .addItem(product2, 2)
        .applyDiscount(10);

    console.log(`商品数量: ${cart.itemCount}`); // 商品数量: 3
    console.log(`总金额: ${cart.total}`); // 总金额: 4680

    const receipt = cart.checkout();
    console.log(receipt);
  ```

## 类继承
  ```js
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
  ``` 
* es5 与 es6 继承的区别:
  - es5 是先创造子类的实例对象 this，然后再将父类的方法添加到 this 上面（Parent.apply(this)）
  - es6 实质是先创造父类的实例对象 this（所以必须先调用super方法），然后再用子类的构造函数修改 this。