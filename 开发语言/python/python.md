# python
> 强类型的解释型语言
## 入门程序
  - Python 没有 {}，靠缩进（通常 4 个空格）表示代码块。
  ```py
    if x > 0:
        print("正数")
    else:
        print("非正数")
  ```

## 执行过程
* 源代码 -> 解释器 -> 字节码 -> python虚拟机 -> 执行
* python代码执行
  ```py
    # python [-bBdEhiIOqsSuvVWx?] [-c command | -m module-name | script | - ] [args]
    python myscript.py
  ```

## 配置开发环境
* [环境配置](./环境配置.md)
* [vscode配置](./vscode配置.md)

## 数据类型
> 动态类型，无声明关键字，Python 直接赋值即可，不写 let/var/const。
### 基本类型
* 数字类型:int（无限精度）、float、complex
* 文本类型：str
  -（不可变，单双引号皆可）
  - 转成列表 list(str)
* bool：（首字母大写 True/False）
  - Python 的“假值”有：False、None、0、0.0、""、空容器 [] {} () 
* None 空值
* 示例
  ```py
    x = 10 ** 100  # 很大的整数，JS 需要 BigInt
    y = 3.14
    flag = True
    empty = None
  ```

### 复合类型
* 序列类型
  + list 列表，可变序列（≈ JS 数组）
    - 创建
    ```py
        a = [1, 2, 3]
        b = list("abc")         # ['a', 'b', 'c']  类似 [...'abc']
        c = [0] * 5             # [0, 0, 0, 0, 0]  重复
    ```
    - 常用操作：索引、切片、追加、删除
    ```py
        # 索引（和 JS 一样从 0 开始，支持负数）
        arr = [10, 20, 30, 40, 50]
        arr[0]      # 10
        arr[-1]     # 50 (最后一个)
        arr[-2]     # 40

        # 切片（Slice）—— Python 的杀手锏
        # 语法：[start:stop:step]，区间左闭右开 [start, stop)。返回新列表，原列表不变。
        # 切片可以用于 list、tuple、str 等所有序列类型，非常统一
        arr[1:4]      # [20, 30, 40]  (不包含索引4)
        arr[:3]       # [10, 20, 30]  起始省略代表0
        arr[2:]       # [30, 40, 50]  结束省略代表末尾
        arr[::2]      # [10, 30, 50]  步长为2，隔一个取一个
        arr[::-1]     # [50, 40, 30, 20, 10]  倒序复制！

        # 遍历
        index = 0
        while index < len(arr):
            print(arr[index])
            index += 1

        # 使用 enumerate() 函数获取索引和值
        for index, element in enumerate(arr):
            print(f"Index {index}: {element}")

        arr[1] = 99            # 直接赋值
        arr[1:3] = [7, 8, 9]   # 切片替换，可改变长度
        del arr[2]             # 删除指定位置

    ```
  + 其他常用方法
    ```py
        arr.append(60)        # 尾部追加，类似 push
        arr.insert(1, 25)     # 指定位置插入
        arr.extend([70, 80])  # 拼接另一个可迭代对象，类似 concat
        arr.remove(20)        # 删除第一个匹配的值
        popped = arr.pop()    # 移除并返回最后一个，也可以 pop(0)
        arr.index(30)         # 返回第一个匹配的索引，找不到抛 ValueError
        arr.count(20)         # 计数
        arr.sort()            # 原地排序，返回 None（这一点易错！）
        sorted(arr)           # 返回新排序列表，不改变原列表
        b = arr.copy()          # 复制是浅拷贝：b = a 是引用。正确的复制：copy
    ```
  + tuple(元组) 不可变序列
    - 创建
    ```py
      # 创建一个包含元素的元组
      t1 = (1, 2, 3, 4, 5)
      t2= 1, 2, 3, 4, 5 # 括号可省略
      t3 = (42,)            # 单元素必须加逗号，否则会被当作普通括号
      t4 = tuple([1,2,3])   # 从列表转换
    ```
    + 特性
      - 不可变：不能增删改元素，没有 append、remove 等方法。
      - 占用内存比列表小，访问速度略快。
      - 因为不可变，它可以是可哈希的（里面元素也必须可哈希），所以能作为 dict 的键或 set 的元素。
      - 常用于函数多返回值、坐标、记录等。
    + 解包
      ```py
        point = (3, 5)
        x, y = point           # x=3, y=5

        # 与列表通用，更灵活的星号解包
        first, *rest = (1, 2, 3, 4)   # first=1, rest=[2,3,4]
      ```
* dict 键值对（≈ JS 对象 / Map）
  - 创建
  ```py
    d = {"name": "Alice", "age": 30}
    d = dict(name="Alice", age=30)    # 关键字形式，仅当键是合法标识符
    d = dict([("a", 1), ("b", 2)])    # 从可迭代对创建
  ```
  - 访问与修改
  ```py
    d["name"]                # 'Alice' 不存在时会抛出 KeyError
    d.get("height", 170)     # 安全获取，不存在返回默认值，不报错
    d["height"] = 175        # 添加新键值
    del d["age"]             # 删除键
    d.keys()                 # 所有键的视图（可迭代）
    d.values()               # 所有值的视图
    d.items()                # 键值对视图，常用于遍历

    # 遍历字典
    for key,value in d.items()
        print(f"{key}: {value}")

    # 字典合并（类似 JS 的扩展运算符）
    d1 = {"a": 1, "b": 2}
    d2 = {"b": 3, "c": 4}
    merged = {**d1, **d2}           # {'a':1, 'b':3, 'c':4} 后者覆盖前者（3.5+）
    # 或者用 |
    merged2 = d1 | d2               # Python 3.9+ 新增字典合并运算符

  ```
* set 无序、不重复元素集合（≈ JS Set）
  - 创建
  ```py
    s = {1, 2, 3, 3}     # {1,2,3} 自动去重
    s = set([1,2,3,2])   # 从可迭代对象创建
    empty = set()        # 空集合必须用 set()，不能用 {}，因为 {} 是空字典
  ```
  - 常用操作
  ```py
    s.add(4)                     # 添加元素
    s.remove(2)                  # 删除，不存在抛 KeyError
    s.discard(10)                # 安全删除，不存在不报错
    s.pop()                      # 随机移除一个（无序！）
    a = {1,2,3}
    b = {2,3,4}
    a | b          # {1,2,3,4}  并集
    a & b          # {2,3}      交集
    a - b          # {1}        差集（a 有 b 无）
    a ^ b          # {1,4}      对称差集
  ```

### 推导式
> 推导式是 Python 的语法糖，简洁高效，很多时候可替代 map/filter。
* 列表推导式
  ```py
    squares = [x**2 for x in range(10) if x % 2 == 0]
    # 相当于 JS: [...Array(10).keys()].filter(x => x%2===0).map(x => x**2)
  ```
* 字典推导式
  ```py
    word = "hello"
    char_count = {ch: word.count(ch) for ch in set(word)}
    # {'h':1, 'e':1, 'l':2, 'o':1}
  ```
* 集合推导式
  ```py
    {x for x in 'abracadabra' if x not in 'abc'}   # {'r', 'd'}
  ```

### 成员检测
```py
    if "a" in ['a','b','c']:
        print("存在")
    # 对 dict 检查键的存在："key" in my_dict
    # 这和 JS 的 includes/hasOwnProperty 类似但更统一。
```

## 流程控制
* 条件判断：if / elif / else
  ```python
    if True:
        print('真')
    else:
        print('假')

    # python 3.10
   match 类似于 switch case
   match httpStatus:
      case 200:
        print('200')
      case 404:
        print('404')
      case 500:
        print('500')
      case _:
        print('default')
  ```
* 循环
  - for ... in ... 直接遍历可迭代对象
  - while 循环类似
* 三元表达式
  - value_if_true if condition else value_if_false
  ```python
    x = 10
    result = "Even" if x % 2 == 0 else "Odd"
    print(result)  # 输出: Even
  ```
* 格式化输出
  ```python
   # 1.百分号 %：
   "%s is %s then %s" %("a","b","c")
    # 2 format 函数
    “{1} is {2} then {0}”.format("a","b","c")

    # 推荐 3 f-strings python3.6
    B="b1",a="1"
    f"{B}is {a}"

    f"{对象：宽度.精度类型}"
    f"{num:4f}" # 指定类型后，默认保存小数点后6位
  ```

## 函数
* 函数定义
  ```python
    def add(num):
        return num+1
  ```
* 参数
  - 支持位置参数、默认参数、关键字参数、可变参数 *args（元组）、**kwargs（字典）。
  - *args 类似 JS 的 ...rest，但不能直接叫 rest 语法，功能相近。
* 类型注解（Type Hints）
  - Python 是动态类型，但支持渐进式类型注解，类似 TypeScript 之于 JS
  - 运行时不做类型检查，完全可选。
  - 可通过 mypy 做静态检查，或搭配 IDE（PyCharm、VSCode）提供智能提示。
  - 配合 dataclasses、Pydantic 等能极大提升代码健壮性。
  ```py
    def greet(name: str) -> str:
        return f"Hello, {name}"
  ```
* 全局变量
  ```py
    global_var = 42  # 这是一个全局变量

    def print_global():
        print(global_var)  # 访问全局变量

    def modify_global():
        global global_var  # 声明要使用全局变量，否则会创建一个新的局部变量
        global_var = 100  # 修改全局变量
  ```
* 函数注释
  - vscode 插件 autoDocstring 会自动生成
  ```py
  def read_by_path(img_path: str | Path):
    """本地路径读取

    Args:
        img_path (str | Path): 本地路径
    Returns:
        _type_: img_path
    """
    return img_path
  ```
  
## 面向对象：类与继承
> Python 的 OOP 比 JS 的 class 更“传统”，但不是基于原型链。
  - self 显式作为第一个参数
  - 没有 new 关键字，直接 Dog("Buddy")。
  ```py
    class Animal:
        def __init__(self, name):  # 构造函数，self 相当于 this
            self.name = name
        def speak(self):
            print(f"{self.name} makes a sound")

    class Dog(Animal):
        def speak(self):
            print(f"{self.name} barks")

    dog= Dog("Buddy")
    dog.speak()
  ```

## 模块与包
* 文件即模块：一个 .py 文件就是一个模块。
* 导入：使用 import，和 JS 的 import 很像，但语法有差异：
    ```py
        import math            # 类似js import * as math from "math"
        from math import sqrt  # 类似js import { sqrt } from "math"
        import numpy as np     # 别名
    ```
* __name__ == "__main__" 
  - 用于判断当前脚本是否作为主程序直接运行，而不是被导入到其他模块中作为库使用。
  - 常用于测试代码、命令行工具或模块的演示功能。
  + 工作原理
    - 当脚本被直接执行时（如 python script.py），__name__ 的值会被设置为 "__main__"。
    - 当脚本被导入到另一个模块（import script）时，__name__ 的值会变成该模块的文件名（不含 .py 后缀）。
    ```py
        # my_module.py
        def main():
            print("程序入口")

        if __name__ == "__main__":
            main()
        # 直接运行 python my_module.py → 执行 main()
        # 在其他文件中 import my_module → 不会自动执行 main()，只有在需要时显式调用 my_module.main()
    ```

* 示例
    - 自定义模块见[demo_python]()
    - 自定义包发布见[demo_python]()

## 标准库
> python标准库功能远大于 JS 的运行时。常用模块：
* 系统：os, sys, pathlib（现代路径操作）
* 文件格式：json, csv, xml, configparser
* 网络：urllib, http.server
* 数据处理：re, datetime, collections, itertools, functools
* 进程/线程：subprocess, threading, multiprocessing
* 开发调试：unittest, logging, pdb

## 异步编程
* 核心模型相似，但运行方式不同：
  - JS 中 async 函数返回 Promise，由事件循环自动驱动。
  - Python 的 async def 返回协程对象，需要显式用 asyncio.run() 启动事件循环（3.10+ 可以在 asyncio.run() 里做事）。
* 示例
  ```py
    import asyncio

    async def fetch_data():
        await asyncio.sleep(1)
        return "data"

    async def main():
        result = await fetch_data()
        print(result)

    asyncio.run(main())
  ```
* GIL（全局解释器锁） 的存在使得多线程无法利用多核执行 CPU 密集型任务，异步仅适用于 IO 密集型。解决多核需要多进程（multiprocessing）或使用 C 扩展。

## 文件管理

## 错误与异常处理
  - 除了SystemExit 异常外，都会打印栈回溯信息
  ```py
    # 基本的异常捕获
    try:
        # 可能出现异常的代码
        1/0
    except Exception as e:
        # 捕获指定异常后执行的代码
        print('发生异常了:',e)
    else:
        # try部分的代码没有抛出异常，执行此代码
    finally:
        # 无论是否抛出异常，都会执行
        print('finally 部分执行')

    # 自定义异常捕获
    class MyException(Exception):
        print('自定义异常')
    try:
        raise MyException
        except Exception as e:
            # 捕获指定异常后执行的代码
            print('发生异常了:',e)

    # 导包的异常报错
    try:
        import onnxruntime
    except ImportError:
        raise ImportError(
            "Unable to import dependency onnxruntime. "
        )
  ```

## 进阶知识
* 对象的比较复制

* 参数的传递

* 迭代器

* 生成器

* 装饰器

* 元类

* 操作符重载

* 上下文管理器

* 并发编程
  - 见 demo_python 多线程
  - 见 demo_python 多进程
  
* 全局解释器锁

* 垃圾回收机制

* 和c++ 的混合使用
  - 使用 pythran 库将Python转换为c++

## Web 开发
* Flask：轻量，类似 Express。
* Django：全栈“全家桶”，自带 ORM、认证、管理后台，类似一个功能完备的 Rails/Laravel。
* FastAPI：现代异步 Web 框架，利用类型注解自动生成 API 文档，性能极高，常用于构建 API。配套Pydantic 做数据校验。

## 数据科学与计算
> 这是 Python 远超 JS 的领域
* NumPy
  - 多维数组与数学运算，类似 MATLAB
  - [NumPy](./NumPy.md)
* pandas：数据分析核心，提供 DataFrame（≈ 加强版电子表格/SQL 表）。
* Matplotlib / Seaborn：图表绘制。

## 自动化与运维
* 脚本化替代 Shell，配合 os, shutil, pathlib。
* Ansible、SaltStack（自动化运维工具）。
* Selenium 自动化浏览器，Scrapy 爬虫框架。
