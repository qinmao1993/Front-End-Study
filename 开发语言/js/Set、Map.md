# Set、Map
 Set、Map、WeakSet 和 WeakMap 是 js 中的四种集合类型，它们分别用于存储唯一值、键值对以及弱引用的数据

## Set
* 定义：是一种值的集合，类似于数组，但是成员的值都是唯一的。
* 常用方法
  - add(value)    添加值，返回 Set 结构本身。
  - delete(value) 删除某个值，返回一个布尔值
  - has(value)    返回一个布尔值，表示该值是否为Set的成员
  - clear()  清除所有成员，没有返回值。
  - size 返回 Set 实例的成员总数。

* 示例
  ```js
    const set = new Set();
    set.add(1);
    set.add(2);
    set.add(2); // 重复值，不会被添加
    console.log(set.size); // 2
    console.log(set.has(1)); // true

    [2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));
    for (let i of s) {
        console.log(i); //  2 3 5 4
    }
    
    // Set函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。
    const set = new Set([1, 2, 3, 4, 4]);
    [...set]
    // [1, 2, 3, 4]

    // 向 Set 加入值的时候，不会发生类型转换 5和"5"是两个不同的值,类似===

  ```
* 遍历操作
    ```js
       // 由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以 keys 方法和 values 方法的行为完全一致。
        let set = new Set(['red', 'green', 'blue']);
        for (let item of set.keys()) {
            console.log(item);
        }
        // red
        // green
        // blue

        for (let item of set.values()) {
            console.log(item);
        }
        // red
        // green
        // blue

        for (let item of set.entries()) {
            console.log(item);
        }
        // ["red", "red"]
        // ["green", "green"]
        // ["blue", "blue"]

        // 可以用 of 直接遍历
        for (let x of set) {
            console.log(x);
        }
        set.forEach((value, key) => console.log(key + ' : ' + value))
        // 数组的 map 和 filter 方法也可以间接用于 Set 了。

    ```
* 应用场景
  - 去重
  ```js
    // 数组
    [...new Set(array)]
    Array.from(new Set(array));

    // 字符串
    [...new Set('ababbc')].join('')
  ```
  - 取交集、并集、差集
   ```js
    let a = new Set([1, 2, 3]);
    let b = new Set([4, 3, 2]);

    // 并集
    let union = new Set([...a, ...b]);
    // Set {1, 2, 3, 4}

    // 交集
    let intersect = new Set([...a].filter(x => b.has(x)));
    // set {2, 3}

    // （a 相对于 b 的）差集
    let difference = new Set([...a].filter(x => !b.has(x)));
    // Set {1}
   ```

## Map
* 定义：
  - 是一种 键值对的集合，其中的键 唯一（不允许重复）。
  - 类似于对象，但键可以是任意类型（对象、函数等）。
  - Map 会记住键的原始插入顺序
* 常用方法
  - set(key, value)：添加键值对。
  - get(key)：获取值。
  - delete(key)：删除键值对。
  - has(key)：检查键是否存在。
  - clear()：清空集合。
  - size：获取集合的大小。
* 示例
  ```js
    const m = new Map();
    const o = { p: 'Hello World' };

    m.set(o, 'content')
    m.get(o) // "content"

    m.has(o) // true
    m.delete(o) // true
    m.has(o) // false

    // Map 也可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组。
    const map = new Map([
        ['name', '张三'],
        ['title', 'Author']
    ]);

    map.size // 2
    map.has('name') // true
    map.get('name') // "张三"
  ```
* 遍历
  ```js
    const map = new Map([
        ['F', 'no'],
        ['T',  'yes'],
    ]);

    for (let key of map.keys()) {
        console.log(key);
    }
    // "F"
    // "T"

    for (let value of map.values()) {
        console.log(value);
    }
    // "no"
    // "yes"

    for (let item of map.entries()) {
        console.log(item[0], item[1]);
    }
    // "F" "no"
    // "T" "yes"

    // 或者
    for (let [key, value] of map.entries()) {
        console.log(key, value);
    }
    // "F" "no"
    // "T" "yes"

    // 等同于使用map.entries()
    for (let [key, value] of map) {
        console.log(key, value);
    }
    // "F" "no"
    // "T" "yes"

    const map = new Map([
        [1, 'one'],
        [2, 'two'],
        [3, 'three'],
    ]);

    [...map.keys()]
    // [1, 2, 3]

    [...map.values()]
    // ['one', 'two', 'three']

    [...map.entries()]
    // [[1,'one'], [2, 'two'], [3, 'three']]

    [...map]
    // [[1,'one'], [2, 'two'], [3, 'three']]
  ```
* 应用场景
  - 保持插入顺序
  ```js
    const map = new Map();
    map.set('z', 1);
    map.set('a', 2);
    map.set('m', 3);

    // 遍历时保持插入顺序
    for (let [key, value] of map) {
        console.log(key); // z, a, m (插入顺序)
    }

    const obj = { z: 1, a: 2, m: 3 };
    // 对象属性顺序不保证
    for (let key in obj) {
        console.log(key); // 可能是 a, m, z (不一定)
    }
  ```

## WeakSet
* 定义
  - WeakSet 是一种值的集合，其中的值必须是对象，且是弱引用
  - 弱引用意味着如果对象没有被其他地方引用，它会被垃圾回收
* 特点：
  - 值必须是对象
  - 不可遍历（没有 size、forEach 等方法）
  - 弱引用，不会阻止垃圾回收
* 常用方法
  - add(value)：添加值。
  - delete(value)：删除值。
  - has(value)：检查值是否存在。
* 示例
 ```js
    const weakSet = new WeakSet();
    const obj = {};
    weakSet.add(obj);
    console.log(weakSet.has(obj)); // true
 ```
 
## WeakMap
* 定义
  - WeakMap 是一种键值对的集合，其中的键必须是对象，且是弱引用。
  - 弱引用意味着如果键对象没有被其他地方引用，它会被垃圾回收。
  - 不可遍历（没有 size、forEach 等方法）。
* 常用方法
  - set(key, value)：添加键值对。
  - get(key)：获取值。
  - delete(key)：删除键值对。
  - has(key)：检查键是否存在。

* 示例
  ```js
    const weakMap = new WeakMap();
    const key = {};
    weakMap.set(key, 'value');
    console.log(weakMap.get(key)); // value
  ```