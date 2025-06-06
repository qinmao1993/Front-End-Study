import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";

// 路由懒加载:lazy,Suspense

const MyDemo = lazy(() => import("../pages/MyDemo"));
const App = lazy(() => import("../pages/App"));
const Layout = lazy(() => import("../pages/Layout"));
const NotFound = lazy(() => import("../pages/NotFound")); 

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
