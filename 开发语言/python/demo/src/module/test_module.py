# test_module.py

def greet(name):
    print(f"Hello, {name}!")

def add(a, b):
    return a + b



# 作为模块导入时，以下代码不会执行，作为模块测试用
if __name__ == "__main__":
    greet("Bob")
    result = add(2, 4)
    print("Result:", result)
