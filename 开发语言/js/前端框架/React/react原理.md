# React 原理
## vdom
  - 用js对象去描述一个DOM结构，虚拟DOM不是直接操作浏览器的真实DOM，而是首先对 UI 的更新在虚拟 DOM 中进行，再将变更高效地同步到真实 DOM 中。
  + 性能优化：
    - 直接操作真实 DOM 是比较昂贵的，尤其是当涉及到大量节点更新时。虚拟 DOM 通过减少不必要的 DOM 操作，主要体现在diff算法的复用操作，其实也提升不了多少性能。
  + 跨平台性：
    - 虚拟 DOM 是一个与平台无关的概念，它可以映射到不同的渲染目标，比如浏览器的 DOM 或者移动端(React Native)的原生 UI。

## fiber
  - 为了解决 React15 在大组件更新时产生的卡顿现象，React团队提出了 Fiber 架构，并在 React16 发布，将 同步递归无法中断的更新 重构为异步的可中断更新
  + 实现了4个具体目标:
    1. 可中断的渲染：Fiber 允许将大的渲染任务拆分成多个小的工作单元（Unit of Work），使得 React 可以在空闲时间执行这些小任务。当浏览器需要处理更高优先级的任务时（如用户输入、动画），可以暂停渲染，先处理这些任务，然后再恢复未完成的渲染工作。
    2. 优先级调度：在 Fiber 架构下，React 可以根据不同任务的优先级决定何时更新哪些部分。React 会优先更新用户可感知的部分（如动画、用户输入），而低优先级的任务（如数据加载后的界面更新）可以延后执行。
    3. 双缓存树（Fiber Tree）：Fiber 架构中有两棵 Fiber 树——current fiber tree（当前正在渲染的 Fiber 树）和 work in progress fiber tree（正在处理的 Fiber 树）。React 使用这两棵树来保存更新前后的状态，从而更高效地进行比较和更新。
    4. 任务切片：在浏览器的空闲时间内（利用 requestIdleCallback思想），React 可以将渲染任务拆分成多个小片段，逐步完成 Fiber 树的构建，避免一次性完成所有渲染任务导致的阻塞。

## 调度器
  + requestidlecallback
    - 允许开发者在浏览器空闲时运行低优先级的任务，而不会影响关键任务和动画的性能
  + MessageChannel
    - 设计初衷是为了方便在不同的上下文之间进行通讯，如 web Worker,iframe 它提供了两个端口（port1 和 port2），通过这些端口，消息可以在两个独立的线程之间双向传递
    - 首先需要异步，MessageChannel是个宏任务，因为宏任务中会在下次事件循环中执行，不会阻塞当前页面的更新。
    - 没选常见的 setTimeout，是因为 MessageChannel 能较快执行，在 0～1ms 内触发，像 setTimeout 即便设置 timeout 为 0 还是需要 4～5ms。相同时间下，MessageChannel 能够完成更多的任务。
  + 为什么 React 不用原生 requestIdleCallback 实现呢？
    - 兼容性差 Safari 并不支持，每个浏览器实现该API的方式不同，导致执行时机有差异有的快有的慢
    - 控制精细度 React 要根据组件优先级、更新的紧急程度等信息，更精确地安排渲染的工作
    - 执行时机 requestIdleCallback(callback) 回调函数的执行间隔是 50ms（W3C规定），也就是 20FPS，1秒内执行20次，间隔较长。