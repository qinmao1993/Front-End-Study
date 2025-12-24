# chrome 调试

## Elements
* computed 看盒模型信息
* dom 断点的调试
  1. 选择一个dom节点：该节点断点有三个选项 
    - 子树修改（subtree modifications）
    - 属性修改(attibute modifications）)
    - 删除节点(node removal)
  ![dom断点的调试1](./imgs/dom断点调试1.png)

## Sources
* 在浏览器中修改并运行网页的源代码？
  ![修改并运行网页的源代码](./imgs/修改网页源码.png)
* 关键的断点调试策略
  1. XHR/Fetch 断点
    + 场景：最常用、最有效。当接口请求参数（如token、sign）被加密时，直接定位到参数生成的位置。
    + 步骤
       1. 在Sources面板找到XHR/fetch Breakpoints。
       2. 点击+，输入接口URL中的关键词（如/api/login）。
       3. 触发请求后，执行会自动在 send()方法前暂停，通过 Call Stack 回溯调用栈即可找到加密函数
  2. 事件监听器断点
    + 场景：当加密操作由用户点击、输入等事件触发时，用来快速找到事件处理函数
    + 步骤：
        1. 在 Sources 面板找到 Event Listener Breakpoints。
        2. 展开类别（如Mouse），勾选click等事件。
        3. 在页面触发该事件，代码会在事件处理函数处暂停。
  3. DOM 断点
    + 场景：当加密参数或数据的生成与特定DOM元素变化（如属性修改、节点插入）相关联时使用。
    + 步骤：
      1. 在Elements面板右键点击目标DOM元素。
      2. 选择 Break on -> attribute modifications（属性修改）等选项

## Network
* 接口重新请求
  - 点击Fetch/XHR
  - 选择要重新发送的请求
  - 右键选择 Replay XHR
* 复制请求
  - 点击Fetch/XHR
  - 选择 Copy as fetch，或其他
  - 控制台粘贴代码(fetch),终端（curl）
* 网络断点
  - 在发起程序的调用栈中

## performance|performance monitor 性能监控

## memory（内存）
* [参见js内存机制](../../开发语言/js/内存机制.md)

## 其他一些小技巧
* 使用 copy 函数，复制 js 变量，将对象作为入参执行即可
* 截取一张全屏的网页
  - 准备好需要截屏的内容（注意懒加载）
  - 打开开发者工具，cmd + shift + p 执行Command命令
  - 输入 Capture full size screenshot 按下回车