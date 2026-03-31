# react

## 核心定位和设计理念
* 定位：
  - React 将自己定义为 用于构建用户界面的 js 库。它专注于 View 层，对于路由、状态管理（除了局部状态）等，官方不提供一揽子解决方案，而是交由社区（如 React Router、Redux、Zustand 等）来处理。
* 理念：
  - Learn Once, Write Anywhere。React 的核心思想是声明式编程、组件化，以及 “单向数据流”。其核心理念是 UI = f(state)，即界面是状态的函数。React 推崇函数式编程（不可变性、纯函数）。

## 常用 jsx 语法规定
> JSX 是一种 js 的语法扩展，允许你在 js 中直接编写类似 HTML 的代码。它本质上会被编译为 React.createElement 调用。
1. 样式中 class 是保留字，使用 className 代替,内联 style 使用对象
2. 大部分 HTML 和 SVG 属性都用驼峰式命名法表示 如 strokeWidth 代替 stroke-width
3. { title } 动态传递值，也可直接 字符串传递
4. 执行 js 代码需要加 { }
5. children 类似于 vue 中 slot 内容插槽的概念
6. 组件返回值：标签和 return 关键字不在同一行，则必须把它包裹在一对括号中

## 样式作用域
本身不提供原生的样式隔离方案。通常使用 CSS Modules、CSS-in-JS（如 styled-components）或 Tailwind CSS 等方案。

## 响应式原理
* Pull 机制：
  - React 没有细粒度的响应式追踪。当状态改变时（如 setState），React 会重新运行整个组件函数，生成新的虚拟 DOM，然后通过 Diff 算法找出变化并更新真实 DOM。
* 优化：
  - 开发者需要手动优化，例如使用 React.memo、useMemo、useCallback 来避免不必要的子组件重渲染。

## 组件（react v16.8 引入 React Hook）
* 组件定义
  - 类似于 js 函数。它接受任意的入参（即 “props”），并返回用于描述页面展示内容的 React 元素
  ```jsx
    function MyButton(props) {
        const { count }=props
        return (
            <button>Clicked: {count}</button>
        );
    }
  ```
* 组件传值(props)
  - 组件传值：传递任何 js 的值，包括对象、数组、函数、甚至是 JSX
  - 子组件props不能直接修改，数据流向单一性，只能通过父组件传递的方法修改
  ```jsx
    function MyButton({ count }) {
        return (
            <button>
                Clicked {count} times
            </button>
        );
    }
    function MyApp() {
        const number=12
        return (
            <div>
                <MyButton count={number}/>
            </div>
        );
    }
  ```
* 组件内部状态管理（useState）
  + 使用场景：组件内部管理的私有数据，可以随时间改变。当 state 改变时，组件会重新渲染。
  + useState的规定
    - 只能定义在组件顶层
    - 状态的不可变性，修改状态的时候，要用新值替换它
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
  + 组件内常见用法见[ToDoList](./demo.js)
    - 列表渲染: map|filter
    - 条件渲染: if|&&|?:
    - 事件绑定
    - 获取dom: ref
* 组件内的数据获取（useEffect）
  - useEffect 是 React 中的一个核心 Hook，用于在函数组件中处理副作用操作（如数据请求、订阅、DOM 修改等）
  + 基本用法
    ```js
        useEffect(() => {
            // 副作用操作（如 API 请求、事件监听）
            return () => {
                // 清理操作（如取消请求、移除监听）
                // 组件卸载时执行
            };
        }, [dependencies]); // 依赖项数组,参数2 （可选）
    ```
  + 执行时机（依赖第二个参数）
      - 没有第二个参数，在组件渲染完成后执行（包括首次渲染和每次更新后）
      - 如果依赖项数组为空，副作用仅在组件挂载时执行一次，清理函数在卸载时执行。
        ```jsx
            useEffect(() => {
                console.log("组件挂载");
                const timer = setInterval(() => {
                    console.log("定时器执行中。。。");
                }, 1000);
                return () => {
                    console.log("组件卸载")
                    clearInterval(timer);
                };
            }, []);
        ```
      - 有依赖项，组件初始渲染+依赖项发生变化时执行
        ```jsx
            const [count, setCount] = useState(0);
            useEffect(() => {
                console.log("count 变化时执行:", count);
            }, [count]);
        ```
* 组件内容分发（children）
  - 类似vue 中的 solt
   ```jsx
   function ChildrenDemo({ children }) {
        return (
            <div className="card">
            {children}
            </div>
        );
    }
    <ChildrenDemo>
        <p>slot 内容插槽</p>
    </ChildrenDemo>
   ```
* 组件内传入html内容
  - dangerouslySetInnerHtml:类似 vue 中 v-html
  ```jsx
    function TestDemo({ html }){
        return (
           <div className="page"> 
               <div dangerouslySetInnerHTML={{ __html: html }}></div>
           </div>
        )
    }
  ```
* 组件通讯（useContext）消费上下文
  - 父子级组件通讯 props
  - 跨组件通讯 useContext，类似 vue3 中 provide、inject，解决组件逐级透传的问题
    ```js
        import { createContext, useContext } from "react";
        // 1. 顶层创建 context 对象
        const ThemeContext = createContext("light");

        // 2. 在顶层组件 使用 Provider 提供数据
        <ThemeContext.Provider value="dark">
            <ChildrenDemo></ChildrenDemo>
        </ThemeContext.Provider>

        function ChildrenDemo(){
            return (
                 <div className="card">
                    <ThemeDemo></ThemeDemo>
                 </div>
            )
        }
        // 3. 在底层组件 使用 useContext 钩子函数使用数据
        // 跨组件通信：MyDemo-->ChildrenDemo-->ThemeDemo
        function ThemeDemo() {
            const theme = useContext(ThemeContext);
            return <div>当前主题：{theme}</div>;  // theme=dark
        }
    ```
* useRef：获取 DOM 引用或存储可变值。
* 性能优化：缓存计算结果或函数（useMemo|useCallback）
  - useMemo：避免在每次组件渲染时重复执行复杂的计算逻辑，从而优化性能。它类似于 Vue 中的 computed 属性，但需要显式指定依赖项
  ```js
    const [hugeList, setList] = useState([]);
    const filteredList = useMemo(() => {
        // 执行复杂的计算 TODO
        return hugeList.sort((a, b) => a.id - b.id);
    }, [hugeList]); // 仅在 hugeList 变化时重新排序
    console.log('filteredList:',filteredList)
  ```
  - useCallback 缓存函数 在 prop 传递给子组件函数时，会导致子组件重新渲染
  ```jsx
    function Parent() {
        const [count, setCount] = useState(0);
        // 缓存点击回调函数
        const handleClick = useCallback(() => {
            console.log("Count:", count);
        }, [count]); // 依赖 count

        return <Child onClick={handleClick} />;
    }
  ```
* memo 缓存组件
  - memo 缓存组件，防止父组件更新，导致子组件更新
  ```jsx
    const Child = React.memo(({ onClick }) => {
        // 子组件使用 memo 避免无意义重渲染
    });
  ```
* 生命周期(已废弃)
  - 类组件中才有生命周期方法，如 componentDidMount、componentDidUpdate 等

## 路由
* 安装 
  ```bash
   npm i react-router-dom
  ```
* 路由配置
  > React Router 是 React 的多策略路由器,有三种模式可选择，分别是框架、数据、声明
  + 声明
    - 声明式模式支持基本的路由功能，例如将 URL 与组件匹配、在应用程序中导航以及使用
    - 原理：使用 JSX 语法在组件树中直接定义 <Route>，通过 <Routes> 管理路由匹配规则。
    - 特点：简单直观，适合中小型应用
    ```jsx
        // main.jsx
        import React from "react";
        import ReactDOM from "react-dom/client";
        import { BrowserRouter, Routes, Route } from 'react-router';
        import App from "./app";

        const root = document.getElementById("root");
        ReactDOM.createRoot(root).render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="about" element={<About />} />

                    // 嵌套路由
                    <Route path="dashboard" element={<Dashboard />}>
                        <Route index element={<Home />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        );
        // dashboard.jsx
        import { Outlet } from "react-router";
        export default function Dashboard() {
            return (
                <div>
                    <h1>Dashboard</h1>
                    {/* will either be <Home/> or <Settings/> */}
                    <Outlet />
                </div>
            );
        }

    ```
  + 数据（v6.4版本引入）
    - 原理：使用 createBrowserRouter 和 RouterProvider 在 React 渲染树之外定义路由配置，支持数据预加载（loader）、表单处理（action）等高级功能。
    - 特点：解耦路由配置与组件，适合复杂应用,类似 Vue Router 的集中式配置风格
    ```jsx
        // /router/index.js
        import { Suspense, lazy } from "react";
        import { createBrowserRouter } from "react-router-dom";

        const Layout = lazy(() => import("@/layout"));

        const router = createBrowserRouter([{
            path: "/",
            Component: Layout,
            children: [
                { index: true, Component: Home },
                { path: "about", Component: About },
            ]
            // loader: () => fetchData(), // 数据预加载
            // action: async ({ request }) => { // 处理表单提交
            //    const formData = await request.formData();
            //        // 提交逻辑
            //    }
            }
        ]);

        // layout.jsx
        import { Outlet } from "react-router-dom";
        export default function Layout() {
            return (
                <div>
                    <h1>Dashboard</h1>
                    {/* will either be <Home> or <Settings> */}
                    <Outlet />
                </div>
            );
        }


        // App
        import React from "react";
        import { RouterProvider } from "react-router-dom";
        import router from "./router";

        export default function App() {
            return (
               <RouterProvider router={router}></RouterProvider>
            );
        }
    ```
  > 选择建议：小型项目用声明模式（简单直接）。中大型项目推荐数据模式（功能强大，支持异步逻辑），框架模式适合需要深度集成的场景   
* 路由导航
  - 两种写法：声明式、命令式
  ```jsx
    import { Link, NavLink, useNavigate } from "react-router-dom";
    const navigator = useNavigate();

    function TestDemo(){
        return (
            <div>
               {/* 选中高亮 */}
               // className
                <NavLink to="/messages"
                    className={({ isActive }) =>
                        isActive ? "text-red-500" : "text-black"
                    }
                    >
                    Messages
                </NavLink>

                {/* 不需要选中高亮（active） */}
                <Link to="/">声明式跳转</Link>

                <button onClick={() => navigator("/")}>
                    命令式跳转
                </button>
            </div>
        )
    }

  ```
* 路由参数
  ```js
    import { useParams,useSearchParams } from "react-router-dom";
    function App(){
        return (
            <div>
                <Link to="/demo?name='test'&id=12">MyDemo search 参数</Link>
                <Link to="/demo/111">MyDemo params 参数</Link>
            </div>
        )
    }
    // 查询参数：
    const [params] = useSearchParams();
    // console.log("params:", params.get("name"), params.get("id"));

    // 获取 URL 参数
    const params = useParams();
  ```




## 状态管理 
* Redux 最常用的状态管理库 
  - 类似于vue 中的Pinia(vuex)
  - 安装 Redux Toolkit 和 react-redux
* zustand 极简的状态管理

## React 生态 
* 构建工具与环境
    ```bash
    # 官方：底层由 webpack 构建（已不推荐）
    npx create-react-app my-app 
    npx create-react-app my-app --template typescript

    # vite 需要 Node.js 版本 18+ 或 20+ 
    npm create vite@latest demo-vite-react -- --template react
    npm create vite@latest demo-vite-react -- --template react-ts 

    # 推荐 SWC 是一个现代的 js 和 TypeScript 编译器，它的目标是提供比 Babel 更快的编译速度。
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
* 使用 React.lazy 和 React.Suspense 延迟加载不需要立马使用的组件
