# pywinauto
> 主要操作于Windows标准图形界面

## 检测要控制的应用是什么技术实现的
* windows上受支持的有两种：
  + Win32 API (backend= "win32") 默认 
    - MFC, VB6, VCL, 简单的WinForms控件和大多数旧的遗留应用程序
  + MS UI Automation (backend="uia")
    - WinForms, WPF, Store apps, Qt5, 浏览器
    >  Chrome在启动之前需要--force-renderer-accessibility cmd标志。 由于comtypes Python库限制，不支持自定义属性和控件。
* 控制应用
  ```py
    from pywinauto import Application
    import time
    # 启动记事本程序
    app = Application(backend="uia").start("notepad.exe")
   
  ````
* GUI常用的元素定位工具：
  1. Inspect（定位元素工具（uia））
    - 需要安装 windows sdk
    - 安装完在 C:\Program Files (x86)\Windows Kits\10\bin 下搜 inspect选 x64下的
    - window11 位于：C:\Program Files (x86)\Windows Kits\10\bin\10.0.19041.0\x64
  2. Spy++ （定位元素工具（win32））
  3. 微软推出了Accessibility Insights 工具代替 Inspect

## 启动并创建一个实例对象：connect 或 start
* 应用未启动： start(self, cmd_line, timeout=app_start_timeout)  
 ```python
    # 启动Excel
    app = Application(backend = "uia").start(r"E:\Office\Office14\EXCEL.exe") 
    # 启动微信
    app = Application(backend = "uia").start(r'C:\Program Files (x86)\Tencent\WeChat\WeChat.exe') 
 ```
* 应用已运行（程序已准备好）： connect(self, **kwargs) 
  1. process：应用程序的进程ID
  2. handle:应用程序窗口的窗口句柄
  3. path: 进程的可执行文件的路径 
  4. 指定窗口的参数的任意组合
  ```python
    app = Application().connect(process=2341)
    app = Application().connect(handle=0x010f0c)
    app = Application().connect(path=r"c:\windows\system32\notepad.exe")
    app = Application().connect(title_re=".*Notepad", class_name="Notepad") 
  ```
* 跨进程访问
  - 一个程序有多个进程 如 Win10 Calculator 
  ```py
    from subprocess import Popen
    from pywinauto import Desktop

    Popen('calc.exe', shell=True)
    desktop=Desktop(backend="uia")
    dlg = desktop.window(title="计算器")
    dlg.print_control_identifiers()
  ```

## Application对象app的常用方法：
* app.top_window() 
  - 返回应用程序当前顶部窗口，是 WindowSpecification 对象，可以继续使用对象的方法往下继续查找控件
  - eg：app.top_window().child_window(title='地址和搜索栏', control_type='Edit')
* app.window(**kwargs) 
  - 根据筛选条件，返回一个窗口， 是 WindowSpecification 对象，可以继续适用对象的方法往下继续查找控件
  - eg: 微信主界面 app.window(class_name='WeChatMainWndForPC')
* app.windows(**kwargs) 
  -  根据筛选条件返回一个窗口列表，无条件默认全部 列表项为 wrapped(装饰器)对象，可以使用 wrapped 对象的方法，注意不是 WindowSpecification 对象
  - eg：[<uiawrapper.UIAWrapper - '李渝的早报 - Google Chrome', Pane, -2064264099699444098>]

* Application.is_process_running() 检查进程是否正在运行。可以在启动/连接之前调用。如果进程正在运行，则返回true；否则返false。
* app.kill(soft=False) 强制关闭
* app.cpu_usage()  返回指定秒数期间的CPU使用率百分比
* app.wait_cpu_usage_lower(threshold=2.5, timeout=None, usage_interval=None) 
  - 等待进程CPU使用率百分比小于指定的阈值 threshold
* app.is64bit() 如果操作的进程是64-bit，返回 True

## 操作控件的步骤
1. 实例化要操作的进程，得到 Application 对象
  - eg：app=Application().connect(process=8948)
2. 选择窗口：app.window(‘一个或多个筛选条件’)， 得到的窗口是 WindowSpecification 对象；
3. 基于 WindowSpecification 对象使用其方法再往下查找，定位到具体的控件；
4. 使用控件的方法属性执行需要的操作。

## 控件的定位和常用方法：
* 层级查找控件的方法：定位控件
  - window(**kwargs)  用于窗口的查找
  - child_window(**kwargs)  可以无视层级的找后代中某个符合条件的元素===>【最常用】
  - parent()  返回此元素的父元素,没有参数
  - children(**kwargs) 返回符合条件的子元素列表,支持索引，是BaseWrapper对象（或子类）
* kwargs筛选条件：
  + 常用的
    - class_name=None,  类名
    - class_name_re=None,  正则匹配类名
    - title=None,  控件的标题文字，对应inspect中Name字段
    - title_re=None, 正则匹配文字
    - control_type=None,  控件类型，inspect界面 LocalizedControlType 字段的英文名
    - best_match=None,  模糊匹配类似的title
    - auto_id=None,  inspect界面 AutomationId 字段，但是很多控件没有这个属性
* 控件常用操作
  + 只支持窗口模式的控件的方法
    - dlg.close()  关闭界面
    - dlg.minimize()  最小化界面
    - dlg.maximize()  最大化界面
    - dlg.restore()  将窗口恢复为正常大小，比如最小化的让他正常显示在桌面
    - dlg.get_show_state()  正常0，最大化1，最小化2
    - dlg.menu_select()  菜单栏，eg：app.window.menu_select(Edit -> Replace)

  + 窗口等待
      - dlg.wait(wait_for, timeout=None, retry_interval=None)  等待窗口处于特定状态
      - dlg.wait_not(wait_for_not, timeout=None, retry_interval=None)  等待窗口不处于特定状态，即等待消失
    + wait_for/wait_for_not:
        - 'exists' means that the window is a valid handle
        - 'visible' means that the window is not hidden
        - 'enabled' means that the window is not disabled
        - 'ready' means that the window is visible and enabled
        - 'active' means that the window is active
        - eg: dlg.wait('ready')
  + 控件的常用方法
    - ctrl.children_texts() 所有子控件的文字列表，对应inspect中Name字段
    - ctrl.window_text()  控件的标题文字，对应inspect中Name字段
    - ctrl.class_name()   控件的类名
    - ctrl.exists(timeout=None, retry_interval=None)  判断控件是否存在窗口中

  + 控件点击输入
    - ctrl.click_input()  单击（最常用）
    - ctrl.double_click_input 双击
    - ctrl.right_click_input() 右键单击

    - edit_ctrl.type_keys('test') 在输入框模拟键盘输入
    - edit_ctrl.set_edit_text('test') 输入框直接赋值
    - edit_ctr.type_keys('^a').type_keys('test', with_spaces=True)  ctrl+a全选，再输入替换

    - ctrl.draw_outline(colour='green')  空间外围画框，便于查看，支持'red', 'green', 'blue'
    - ctrl.print_control_identifiers(depth=None, filename=None)  以树形结构打印其包含的元素，详见打印元素 
    + ctrl.scroll(direction, amount, count=1,)  滚动
      - direction ："up", "down", "left", "right"
      - amount："line" or "page"
      - count：int 滚动次数
  + 截图保存
    - ctrl.capture_as_image().save(img_path)

## 鼠标操作
  ```py
    from pywinauto import mouse

    mouse.move(coords=(x, y)) # 移动鼠标
    mouse.click(button='left', coords=(40, 40)) # 指定位置，鼠标左击
    mouse.double_click(button='left', coords=(140, 40)) # 鼠标双击
    mouse.press(button='left', coords=(140, 40)) # 将属性移动到（140，40）坐标处按下
    mouse.release(button='left', coords=(300, 40)) # 将鼠标移动到（300，40）坐标处释放
    mouse.right_click(coords=(400, 400)) # 右键单击指定坐标
    mouse.wheel_click(coords=(400, 400)) # 鼠标中键[滚轮]单击指定坐标(很少用的到)
    mouse.scroll(coords=(1200,300),wheel_dist=-3) # 滚动鼠标 wheel_dist指定鼠标滚轮滑动，正数往上，负数往下
    check_by_click() # 通过click()方法勾选checkbox
    uncheck_by_click() # 通过click()方法取消勾选checkbox
    get_check_state() # 返回checkbox的勾选状态（0没勾选，1勾选，2不定）
    is_checked() # 勾选返回true，未勾选返回false，不定返回None
    check() # 勾选checkbox
    uncheck() # 不勾选checkbox
    invoke() # 点击(uia mode)
    toggle () # 勾选checkbox(uia mode)

    # 举例：以控件中心为起点，滚动
    def mouse_scroll(control, distance):
        rect = control.rectangle()
        cx = int((rect.left+rect.right)/2)
        cy = int((rect.top + rect.bottom)/2)
        mouse.scroll(coords=(cx, cy), wheel_dist=distance)
    mouse_scroll(control=win_main_Dialog.child_window(control_type='List', title='联系人'), distance=-5)
  ```

## 键盘操作
  - 和控件自己的 type_keys 方法效果一样，但是更快
  - 在发送文件和图片的时候可以使用键盘模块，复制粘贴
  ```py
    from pywinauto import keyboard 
    import time

    chatWin=desktop.window(title="钉钉")
    # 发送 Ctrl + Shift + F 快捷键
    chatWin.type_keys("^+F")  
    time.sleep(1)
    # keyboard.send_keys("qinmao") 
    keyboard.send_keys('文件小助手') # 键入字符串
    time.sleep(2)
    keyboard.send_keys("{ENTER}") 
    # 延迟一段时间等待聊天窗口打开
    time.sleep(1)

  ```