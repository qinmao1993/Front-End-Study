# 基本语法
x = int(input("Please enter an integer: "))

if x < 0:
    x = 0
    print("Negative changed to zero")
# elif x == 0:
#     print('Zero')
# elif x == 1:
#     print('Single')
# else:
#     print('More')

# 设置全局变量
# 全局变量是指在模块的顶层（即不在任何函数或类内部）定义的变量。
# 这些变量可以在模块的任何地方访问和修改。
# 全局变量在模块内具有全局作用域，即在模块的整个生命周期内都有效。

# example.py
global_var = 42  # 这是一个全局变量

def print_global():
    print(global_var)  # 访问全局变量

def modify_global():
    # 注意：如果不使用 global 关键字而试图修改全局变量，
    # Python 会认为你要创建一个局部变量，而不是修改全局变量，从而导致 UnboundLocalError 错误。
    global global_var  # 声明要使用全局变量
    global_var = 100  # 修改全局变量
