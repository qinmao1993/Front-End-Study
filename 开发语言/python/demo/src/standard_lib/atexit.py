import atexit


def cleanup():
    print("Cleaning up before exit")


# atexit 模块只能在正常退出时保证钩子函数被调用，如果程序遇到了致命错误而异常终止，注册的钩子函数可能不会被执行
atexit.register(cleanup)

# 这里是你的程序逻辑
# 当程序退出时，注册的 cleanup 函数会被调用
