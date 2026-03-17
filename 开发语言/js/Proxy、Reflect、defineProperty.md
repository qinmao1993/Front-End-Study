# defineProperty、Proxy、Reflect 
Proxy 和 Reflect 是 ES6 引入的一对重要特性，它们共同提供了一种拦截并自定义 js 对象底层操作的能力。

## Object.defineProperty
* 语法
  ```js
    Object.defineProperty(target, propKey, propDesc)
  ```
  - target 目标对象
  - propKey 需要操作的目标对象的属性名
  - propDesc 描述符
* 示例
  ```js
    // 破解：重定义属性,生产环境去掉这段代码
    Object.defineProperty(SGMap, 'baseApiUrl', {
      get () {
        return ''
      }, // 获取属性的方法。
      set (val) {
       
      },// 设置属性的方法。
      configurable: true, // 属性是否可以被修改或者删除，默认 false。
      enumerable:true, // 属性是否可枚举，默认 false

    })

    console.log(SGMap.baseApiUrl) // ''
  ```

## Proxy
* Proxy 概述
  - Proxy 用于创建一个对象的代理，从而可以拦截并自定义该对象的基本操作（例如属性查找、赋值、枚举、函数调用等）。它允许我们以“元编程”的方式控制对象的行为。

* 基本语法
  ```js
    const proxy = new Proxy(target, handler);
  ```
  - target 要代理的目标对象（可以是任何类型的对象，包括数组、函数、甚至另一个代理）。
  - 一个包含“陷阱”（trap）函数的对象，定义了拦截操作的具体行为。
  + Proxy 支持 13 种内置操作的拦截，最常用的有：
    - get(target, property, receiver)	读取属性	        proxy.name
    - set(target, property, value, receiver)	设置属性	proxy.name = 'value'
    - has(target, property)	in 操作符	                   'name' in proxy
    - deleteProperty(target, property)	delete 操作	       delete proxy.name
    - apply(target, thisArg, argumentsList)	函数调用	    proxy(...args)
    - construct(target, argumentsList, newTarget) new 操作  new proxy(...args)
    - ownKeys(target)	Object.keys(), for...in 等	

* 示例
  - handler 没有设置任何拦截，那就等同于直接通向原对象
  + get(target, propKey, receiver) 拦截对象属性的读取
    ```js
        // receiver 可选参数 proxy 实例本身 
        const person = {
            name: "张三"
        };
        const proxy = new Proxy(person, {
           get: function(target, property) {
               if (property in target) {
                  return target[property];
               } else {
                throw new ReferenceError("Property \"" + property + "\" does not exist.");
               }
            }
        });
        proxy.name // "张三"
        proxy.age // 抛出一个错误
    ```
  + set(target, propKey, value, receiver) 拦截对象属性的设置
    ```js
        // 数据验证的例子
        const handler = {
            set: function(target, prop, value) {
                if (prop === 'age') {
                    if (!Number.isInteger(value)) {
                        throw new TypeError('The age is not an integer');
                    }
                    if (value > 200) {
                        throw new RangeError('The age seems invalid');
                    }
                }
                // 对于满足条件的 age 属性以及其他属性，直接保存
                obj[prop] = value;

            }
        };
        let person = new Proxy({}, handler);
        person.age = 100;

        person.age // 100
        person.age = 'young' // 报错
        person.age = 300 // 报错
    ```
  + has(target, propKey) 拦截 propKey in proxy 的操作，返回一个布尔值。
    - has方法不判断一个属性是对象自身的属性，还是继承的属性
  + deleteProperty(target, propKey)：拦截 delete proxy[propKey]的操作，返回一个布尔值
  + apply(target, thisArg, args)	函数调用
    ```js
    // 重写remove
    const popup = {
        remove() { console.log("popup removed"); }
    };
    // 方案一
    const popupProxy = new Proxy(popup, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === 'function' && prop === 'remove') {
          return function (...args) {
            // 调用原始方法
            const result = value.apply(this, args)
            // 新增逻辑
            app.unmount()
            app = null
            return result
          }
        }
        return value
      }
    })

    // 方案二：apply 是针对函数
    const removeProxy = new Proxy(popup.remove, {
        apply(target, thisArg, args) {
            console.log("apply triggered", args);
            return Reflect.apply(target, thisArg, args);
        }
    });

    const popupProxy = new Proxy(popup, {
        get(target, prop, receiver) {
            if (prop === "remove") return removeProxy;
            return Reflect.get(target, prop, receiver);
        },
    });

    popupProxy.remove();

    ```

## proxy 比 defineProperty 好在哪？
* defineProperty 的缺陷
  - 深度遍历对象的每一个属性，进行监听，效率损失
  - 在 vue中 create 钩子函数里，实例已经创建，对象属性的监听无法检测

* proxy
  - 创建一个代理对象，监听整个对象，对象属性的新增就可以检测到

## Reflect（反射）
> Reflect 是 ES6 引入的一个内置对象，提供了一些与对象操作相关的静态方法。这些方法执行的是 js 语言的默认操作行为。
* 主要特点
  - 所有方法都是静态的（类似 Math 对象）。
  - 方法与 Proxy 陷阱一一对应，例如 Reflect.get()、Reflect.set() 等。
  - 提供了一种更规范、更安全的方式来执行默认操作，尤其是在 Proxy 内部调用原始行为时。

* 语法
  - Reflect.get(target, propertyKey, receiver)
  - Reflect.set(target, propertyKey, value, receiver)
  - Reflect.has(target, propertyKey)
  - Reflect.deleteProperty(target, propertyKey)
  - Reflect.ownKeys(target) 返回对象的所有属性键，包括不可枚举属性和符号属性
  - Reflect.defineProperty(target, propertyKey, attributes) 类似于 Object.defineProperty
  - Reflect.getOwnPropertyDescriptor(target, propertyKey) 获取对象属性的描述符（类似于 Object.getOwnPropertyDescriptor）。

* 常用示例
  ```js
    const obj = { name: 'Alice' };

    Reflect.get(obj, 'name');           // "Alice"
    Reflect.set(obj, 'age', 30);        // true，设置成功
    Reflect.has(obj, 'name');           // true
    Reflect.deleteProperty(obj, 'age'); // true

    const obj = { a: 1 };
    const descriptor = Reflect.getOwnPropertyDescriptor(obj, 'a');
    console.log(descriptor); // 输出: { value: 1, writable: true, enumerable: true, configurable: true }
  ```

## Proxy 与 Reflect 的核心关系
在 Proxy 的陷阱中，通常建议通过调用 Reflect 上的同名方法来执行原始操作。这样做既能保证默认行为的正确性（尤其是正确处理 receiver 和属性描述符），又能简化代码。
```js
    const proxy = new Proxy(target, {
        get(target, prop, receiver) {
            // 在拦截逻辑之前添加自定义行为
            console.log(`Getting ${prop}`);
            // 调用默认的 get 行为
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
            console.log(`Setting ${prop} = ${value}`);
            // 执行默认的 set 行为，并返回布尔值表示成功与否
            return Reflect.set(target, prop, value, receiver);
        }
    });
```

## 应用场景
Proxy 的强大之处在于它可以无侵入地扩展对象的功能，广泛应用于框架、工具库和复杂业务逻辑中。以下是一些典型的应用场景：
* 数据劫持与响应式系统（Vue3 的 reactive）
  - Vue 3 的响应式原理基于 Proxy，通过劫持对象的读写操作来自动追踪依赖并触发更新。
  ```js
    function reactive(target) {
        return new Proxy(target, {
            get(target, key, receiver) {
                // 依赖收集（示例省略具体实现）
                track(target, key);
                return Reflect.get(target, key, receiver);
            },
            set(target, key, value, receiver) {
                const oldValue = target[key];
                const result = Reflect.set(target, key, value, receiver);
                if (oldValue !== value) {
                    // 触发更新
                    trigger(target, key);
                }
                return result;
            }
        });
    }
  ```
* 表单校验
  - 通过 Proxy 拦截对表单数据对象的赋值操作，实时进行校验
  ```js
    function createValidator(formData, rules) {
        return new Proxy(formData, {
            set(target, prop, value) {
                if (rules[prop]) {
                    const isValid = rules[prop].validate(value);
                    if (!isValid) {
                        throw new Error(rules[prop].message);
                    }
                }
                return Reflect.set(target, prop, value);
            }
        });
    }

    const userForm = createValidator({}, {
        age: {
            validate: v => v >= 18 && v <= 60,
            message: '年龄必须在18-60之间'
        }
    });

    userForm.age = 25; // 成功
    userForm.age = 10; // 抛出错误：年龄必须在18-60之间
  ```
* 属性访问控制与权限管理
  ```js
    const secureObj = new Proxy({ _secret: 'classified', public: 'hello' }, {
        get(target, prop) {
            if (prop.startsWith('_')) {
            throw new Error('Access denied to private property');
            }
            return Reflect.get(target, prop);
        },
        set(target, prop, value) {
            if (prop.startsWith('_')) {
            throw new Error('Cannot modify private property');
            }
            return Reflect.set(target, prop, value);
        }
    });
    secureObj.public; // "hello"
    secureObj._secret; // 抛出错误
  ```
* 日志与性能监控
  - 自动记录对象属性访问或方法调用的日志。
  ```js
    function createLogger(obj) {
        return new Proxy(obj, {
            get(target, prop, receiver) {
                const value = Reflect.get(target, prop, receiver);
                if (typeof value === 'function' && prop === 'add') {
                return function (...args) {
                    // 调用原始方法
                    const result = value.apply(this, args)
                    // 新增逻辑
                    console.log(`${prop}方法被调用了`)
                    return result
                }
                }
                return value
            },
        });
    }

    const math = {
        add(a, b) { return a + b; }
    };
    const loggedMath = createLogger(math);
    loggedMath.add(2, 3); // 输出日志并计算结果
  ```
