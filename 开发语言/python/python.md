# python
> 强类型的解释型语言
## python的解释器
- mac 默认的通常被安装在 /usr/bin/python3
- 也可安装不同的版本在别的目录
```bash
  # 启动解释器：可以在 shell 中运行 Python 代码
  cd /usr/bin
  python3 
  
  # 案例1
  1+1
  40-20
  
  # 案例2
  width = 20
  height = 5 * 9
  width * height

  # 输出
  print('name') 
  print(r'C:\some\name')

  ## 输出字符长度
  str = 'supercalifragilisticexpialidocious'
  len(str)

  arr = ['a', 'b', 'c', 'd']
  len(arr)
```
* 调用 Python 时，可以指定下列任意选项
  - python [-bBdEhiIOqsSuvVWx?] [-c command | -m module-name | script | - ] [args]
  - 常见的是执行脚本：python myscript.py
## 执行过程
* 源代码-> 解释器 -> 字节码-> python虚拟机 -> 执行
## 基础语法
### 常见的数据类型
* 数字类型
  - int
  - float 
  - complex
* 文本类型
  - str
  - 转成列表 list(str)
* 序列类型
  + list（数组）
    - 创建
    + 增加：
      - list.insert(索引，元素)
      - list.append(元素) 在尾部增加元素
      - list.extent(可迭代的对象) 为列表拓展元素
    + 修改
      - list.remove(元素)
      - list.reverse() 反转
      - list.pop(索引) 移除索引对应的元素并返回该元素，不指定索引默认是移除最后一个
      - list.copy() 复制列表
      - list.clear() 清空
    + 计算列表长度
      - len(list)
      - len(list[0])
      - list.count(元素) 元素出现的次数
    + 删除：
      - del list[0]、 
      - del list
    + 排序
      - list.sort(reverse=True) 列表原地排序
      - sort(list) 排序后返回新的列表
    ```python
        arr = [1, 2, 3, 4, 5]
        # 使用 for 循环遍历数组
        data=[]
        for item in arr:
            data.append({'test':item})

        for item in data:
            print(item['test'])

        index = 0
        # 使用 while 循环和索引遍历数组
        while index < len(arr):
            print(arr[index])
            index += 1

        # 使用 enumerate() 函数获取索引和值
        for index, element in enumerate(arr):
            print(f"Index {index}: {element}")

        # 排序
        data = [
            {"name": "Alice", "age": 30},
            {"name": "Bob", "age": 25},
            {"name": "Charlie", "age": 35}
        ]

        # 按照"age"字段升序排序
        sorted_data = sorted(data, key=lambda x: x["age"])
        # 按照"age"字段降序排序，缺失字段默认为 -1 或其他适当的值
        sorted_data = sorted(data, key=lambda x: x.get("age", -1), reverse=True)

        print(sorted_data)
        # 输出: [{'name': 'Bob', 'age': 25}, {'name': 'Alice', 'age': 30}, {'name': 'Charlie', 'age': 35}]

        # 修改原始列表并就地排序 就地按"age"字段升序排序
        data.sort(key=lambda x: x["age"])
        
        # 就地按"age"字段降序排序
        data.sort(key=lambda x: x["age"], reverse=True)

    ```
  + tuple(元组)
    - 类似list，但创建后不能修改
    - 对比list执行效率更改
    - 元组通常用于存储不可变的数据集合，比如坐标、日期等
    ```py
      # 创建一个包含元素的元组
      my_tuple = (1, 2, 3, 4, 5)

       # 创建一个空元组
      empty_tuple = ()
    ```
    - range
* 映射类型
  - dict
  ```py
   # 花括号
   dic1={'one':1,'two':2}
    # 类型构造器
   dic2= dict(one=1,two=2)

    # 访问字典中的所有元素
    mail_list=={'tom':'ddd','jerry':'gggg'}
    mail_list.items()
    mail_list.keys() # 键
    mail_list.values() # 值

    # 访问列表中的单独元素
    mail_list.get('tom')
    mail_list['tom']

    # 遍历字典
    for key,value in mail_list.items()
        print(key)
        print(value)
    # 内置函数
    len(字典) 
    key in 字典

    pop 移除键，并返回键对应的值
    popitem 移除键，并返回键值对

    # 字典默认值 setdefault
    mail_list.setdefault('tom') 重复返回已有的值
    mail_list.setdefault('tom2') 新的key 默认值为null

    del 可以删除键
  ```
* 集合
  - python 中的集合（Set）是一种无序且不重复的数据结构。你可以使用大括号 {} 或者 set() 函数来创建集合
  - 集合可以进行并集、交集、差集等操作，方便进行集合运算
  ```py
    # 创建一个空集合
    my_set = set()
    # 创建一个带有初始元素的集合
    my_set = {1, 2, 3, 4, 5}

    # 也可以通过set()函数来创建集合
    my_set = set([1, 2, 3, 4, 5])
  ```
  + 常用的方法：
    - add
    - remvoe
    - pop
    - clear
    - del
* 其他
  - 常量 None
  - 逻辑值 True、False
  - 空集 "、（）、[]、{}、set() rang(0)
* 类型转换
  - TODO 
### 流程控制
* 条件判断
  ```python
    if True:
        print('真')
    else:
        print('假')
    
    // elif xxx:

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
* 文件的输入输出
* 自定义函数
  ```python
    def add(num):
        return num+1
    # 只做类型提示，不做类型校验
    def add1(num:int):
        return num+1
    def test(arg1,arg2,arg3):
        print(arg1,arg2,arg3)
        
    test(1,2,4)
    test(1,arg3=3，arg2=2)
    test(arg1=1,arg3=3，arg2=2)
  ```
* 高阶函数
  - map
  - filter
  - reduce 需要通过fuctools库导入
* 错误与异常处理
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
* 面向对象编程
* 模块
  - 自定义模块见 demo_python 模块内容
  - 自定义包发布见 demo_python 模块内容
### 进阶知识
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
## 包管理
* [pip使用](/包管理/pip.md)
