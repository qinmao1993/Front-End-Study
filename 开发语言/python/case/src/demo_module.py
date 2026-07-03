# 引入自定义的外部模块

# 1. 从模块中引入特定的内容：
from module.test_module import greet, add


# 2. 引入模块并重命名：
import module.test_module as test


# 3. __init__.py 是一个特殊的文件，用于标识目录是一个 Python 包，从而允许 Python 在导入模块时能够正确地识别该目录为包。
# 它可以为空，也可以包含包的初始化代码。

# from my_package import function1, function2

# 从 Python 3.3 开始，__init__.py 文件不是必须的，用于创建包的目录可以没有 __init__.py 文件
# 然而，包含 __init__.py 文件仍然是一种好习惯，尤其是在需要包初始化代码或者希望明确标识包的情况下。


# 4. __all__ 是一个特殊的变量，用于定义一个模块在使用 from module import * 语句时，应该暴露哪些名称。
# 这是 Python 模块的一个惯用方式，用于控制从模块中导入的符号（例如函数、类或变量）的范围。

# 如 你有一个模块 mymodule.py，并且该模块包含多个类、函数和变量。
# 如果你希望在使用 from mymodule import * 时，只暴露部分符号，而隐藏其他内部实现细节，可以使用 __all__ 变量来实现这一点。

# mymodule.py

class FaceAnalysis:
    def __init__(self):
        pass

    def analyze(self):
        pass

def helper_function():
    pass

__all__ = ['FaceAnalysis']

# FaceAnalysis 是你希望在外部使用 from mymodule import * 时暴露的唯一符号。
# 注意：__all__ 只对 from module import * 有效，
# 对其他形式的导入（如 import module 或 from module import some_name）没有影响。


if __name__ == "__main__":
    # greet("Bob")
    # result = add(2, 4)
    # print("Result:", result)

    # test.greet('hhh')





