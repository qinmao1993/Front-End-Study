# react

## 组件
* 概念：
  - 类似于 js 函数。它接受任意的入参（即 “props”），并返回用于描述页面展示内容的 React 元素
* state：
  - 组件的内部状态管理 
  - 使用场景:组件重新渲染时使用
  ```js
    import { useState } from 'react';
    function MyButton() {
        // 从 useState 中获得两样东西：当前的 state（count），以及用于更新它的函数（setCount）
        // 起任何名字，但按照惯例会像 [something, setSomething] 这样为它们命名
        const [count, setCount] = useState(0);
        function handleClick() {
            setCount(count + 1);
        }
        return (
            <button onClick={handleClick}>
                Clicked {count} times
            </button>
        );
    }
  ```
* props：
   ```js
   import { useState } from 'react';
    export default function MyApp() {
        const [count, setCount] = useState(0);

        function handleClick() {
            setCount(count + 1);
        }
        return (
            <div>
            <h1>Counters that update together</h1>
            <MyButton count={count} onClick={handleClick} />
            <MyButton count={count} onClick={handleClick} />
            </div>
        );
    }
    function MyButton({ count, onClick }) {
        return (
            <button onClick={onClick}>
                Clicked {count} times
            </button>
        );
    }
   ```
* 生命周期
  - 类组件中才有生命周期方法，如 componentDidMount、componentDidUpdate 等

## React Hook（16.8 引入）
* useState
  - 只能定义在顶层
  - 状态的不可变性，修改状态的时候，要用新值替换它
  ```js
   const [count, setCount] = useState(0);
   function handleClick() {
        setCount(count + 1);
    }
  ```
* useContext 
  - 类似 vue3 provide inject，解决组件逐级透传的问题
  ```js
    // 1. 顶层创建 context 对象
    const ThemeContext = createContext("light");
    // 2. 在顶层组件 使用 Provider 提供数据
    <ThemeContext.Provider value="dark">
        <ChildrenDemo
          title="子组件标题"
          html={html}
          style={{ color: "red", fontSize: "20px" }}
          onGetMsg={(msg) => receiveMsg(msg)}
        >
          <p>slot 内容插槽</p>
        </ChildrenDemo>
      </ThemeContext.Provider>
    // 3. 在底层组件 使用 useContext 钩子函数使用数据
    // 跨组件通信：MyDemo-->ChildrenDemo-->ThemeDemo
    function ThemeDemo() {
        const theme = useContext(ThemeContext);
        return <div>当前主题：{theme}</div>;
    }
  ```
* useReducer
* useMemo
  - 功能类似于vue的计算属性
  ```js
    const [list, setList] = useState([{
        name:'test'
    }]);

    const filteredList = useMemo(() => {
        return list.filter((item) => item.name.includes('test'));
    }, [list]);
    console.log('filteredList:',filteredList)
  ```
* useEffect
  - 处理副作用（如请求数据、更新订阅等）
  ```js
  import { useEffect } from 'react';
    // 参数：参数1 副作用函数 ajax 获取等
    // 参数2 （可选）
    // 1. 没有依赖项，组件初始渲染+组件更新时执行
    // useEffect(() => {
    //   console.log('useEffect');
    // });

    // 2. 空数组，组件初始渲染时执行一次
    useEffect(() => {
        console.log("useEffect执行：", params);
    }, []);

    // 3. 有依赖项，组件初始渲染+依赖项发生变化时执行
    // count 变化时执行 类似 vue watch
    // useEffect(() => {
    //   console.log("useEffect");
    // }, [count]);

    // 清理副作用
    function TestDemo() {
        useEffect(() => {
            // const timer = setInterval(() => {
            //   console.log("定时器执行中。。。");
            // }, 1000);
            return () => {
            // 组件卸载时自动执行
            // console.log("清理副作用");
            // clearInterval(timer);
            };
        }, []);
        return <div>TestDemo</div>;
    }
  ```

## 路由
* 安装 
  ```bash
   npm i react-router-dom
  ```
* 常见用法
  ```js
    // router
    import { createBrowserRouter } from "react-router-dom";
    import React, { Suspense, lazy } from "react";

    // 路由懒加载:lazy,Suspense
    const MyDemo = lazy(() => import("../pages/MyDemo"));
    const App = lazy(() => import("../pages/App"));
    const Layout = lazy(() => import("../pages/Layout"));
    const NotFound = lazy(() => import("../pages/NotFound")); // 引入 NotFound 组件

    // 创建路由实例
    const router = createBrowserRouter([
    {
        path: "/",
        element: (
        <Suspense fallback={<div>Loading...</div>}>
            <Layout />
        </Suspense>
        ),
        children: [
        {
            // 嵌套路由
            index: true, // 默认二级路由设置
            element: (
            <Suspense fallback={<div>Loading...</div>}>
                <App />
            </Suspense>
            ),
        },
        {
            path: "demo/:id",
            element: (
            <Suspense fallback={<div>Loading...</div>}>
                <MyDemo />
            </Suspense>
            ),
        },
        ],
    },
    {
        path: "*", // 匹配所有未定义的路径
        element: (
        <Suspense fallback={<div>Loading...</div>}>
            <NotFound />
        </Suspense>
        ), // 渲染 NotFound 组件
    },
    ]);

    export default router;

  ```
* 路由传参
  ```js
    // 参数获取 1
    const [params] = useSearchParams();
    // console.log("params:", params.get("name"), params.get("id"));
    // 参数获取 2
    const params = useParams();
  ```
  
## 状态管理 
* Redux 最常用的状态管理库 
  - 类似于vue 中的Pinia(vuex)
  - 安装 Redux Toolkit 和 react-redux
* zustand 极简的状态管理

## 常见的用法(完整demo)
* 用法
  - 组件传值: props
  - 获取dom: ref
  - 列表渲染: map|filter
  - 条件渲染: if|&&|?:
  - 计算属性: useMemo
  - 监听器: useEffect(()=>{},[count])
  - 事件交互：
  - dangerouslySetInnerHtml:类似 vue 中 v-html
* 见 demo-react 项目

## React 生态 
* 构建工具与环境
    ```bash
    # 官方：底层由 webpack 构建
    npx create-react-app my-app 
    npx create-react-app my-app --template typescript

    # vite 需要 Node.js 版本 18+ 或 20+
    npm create vite@latest demo-vite-react -- --template react
    npm create vite@latest demo-vite-react -- --template react-ts 

    # 推荐 SWC 是一个现代的 JavaScript 和 TypeScript 编译器，它的目标是提供比 Babel 更快的编译速度。
    # SWC 使用 Rust 编写，更好的性能。支持多种特性和规范，包括 ES6+ 和 TypeScript 的语法。
    npm create vite@latest demo-vite-react -- --template react-swc
    npm create vite@latest demo-vite-react -- --template react-swc-ts

    ```
  - Next.js
  ```bash
   npx create-next-app@latest
  ```
  - Remix 
  ```bash
    npx create-remix
  ```
* UI 组件库
  - Ant Design
  - Material-UI

## React性能优化手段
* shouldComponentUpdate

* memo|useCallback|useMemo
  - memo 缓存组件，防止父组件更新，导致子组件更新
  - useCallback 缓存函数 在 prop 传递给子组件函数时，会导致子组件重新渲染
  - useMemo 缓存计算的值，在依赖项不变的情况下，返回同一个值
  
* getDerviedStateFromProps
* 使用 Fragment
  - 提供了一种将子列表分组又不产生额外DOM节点的方法
* 使用 React.lazy 和 React.Suspense 延迟加载不需要立马使用的组件

## React 原理
* vdom
  - 用js对象去描述一个DOM结构，虚拟DOM不是直接操作浏览器的真实DOM，而是首先对 UI 的更新在虚拟 DOM 中进行，再将变更高效地同步到真实 DOM 中。
  + 性能优化：
    - 直接操作真实 DOM 是比较昂贵的，尤其是当涉及到大量节点更新时。虚拟 DOM 通过减少不必要的 DOM 操作，主要体现在diff算法的复用操作，其实也提升不了多少性能。
  + 跨平台性：
    - 虚拟 DOM 是一个与平台无关的概念，它可以映射到不同的渲染目标，比如浏览器的 DOM 或者移动端(React Native)的原生 UI。

* fiber
  - 为了解决 React15 在大组件更新时产生的卡顿现象，React团队提出了 Fiber 架构，并在 React16 发布，将 同步递归无法中断的更新 重构为异步的可中断更新
  + 实现了4个具体目标:
    1. 可中断的渲染：Fiber 允许将大的渲染任务拆分成多个小的工作单元（Unit of Work），使得 React 可以在空闲时间执行这些小任务。当浏览器需要处理更高优先级的任务时（如用户输入、动画），可以暂停渲染，先处理这些任务，然后再恢复未完成的渲染工作。
    2. 优先级调度：在 Fiber 架构下，React 可以根据不同任务的优先级决定何时更新哪些部分。React 会优先更新用户可感知的部分（如动画、用户输入），而低优先级的任务（如数据加载后的界面更新）可以延后执行。
    3. 双缓存树（Fiber Tree）：Fiber 架构中有两棵 Fiber 树——current fiber tree（当前正在渲染的 Fiber 树）和 work in progress fiber tree（正在处理的 Fiber 树）。React 使用这两棵树来保存更新前后的状态，从而更高效地进行比较和更新。
    4. 任务切片：在浏览器的空闲时间内（利用 requestIdleCallback思想），React 可以将渲染任务拆分成多个小片段，逐步完成 Fiber 树的构建，避免一次性完成所有渲染任务导致的阻塞。

* 调度器
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