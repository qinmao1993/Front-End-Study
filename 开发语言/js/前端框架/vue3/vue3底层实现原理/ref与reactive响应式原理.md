# ref与reactive的源码实现
ref 和 reactive 是 Vue 3 中用于创建响应式数据的两个核心 API。
它们的底层实现依赖于 Vue 3 的响应式系统，主要通过 Proxy 和 依赖收集 来实现

## reactive 的实现
> reactive 底层实现基于 Proxy，用于将普通对象转换为响应式对象。
* 核心逻辑
  1. 创建 Proxy：使用 Proxy 包装目标对象，拦截对对象的读取（get）和修改（set）操作
  2. 依赖收集：在 get 拦截器中，收集当前正在运行的副作用函数（如组件的渲染函数）。在 set 拦截器中，触发依赖更新。

* 简化实现
  ```js
    function reactive(target) {
        // 如果 target 已经是响应式对象，直接返回
        if (target && target.__v_isReactive) {
            return target;
        }
        // 创建 Proxy
        const proxy = new Proxy(target, {
            get(target, key, receiver) {
                // 依赖收集:将当前运行的副作用函数与目标对象的属性关联
                track(target, key);
                // 返回属性值
                return Reflect.get(target, key, receiver);
            },
            set(target, key, value, receiver) {
                // 设置属性值
                const result = Reflect.set(target, key, value, receiver);
                // 触发依赖更新:找到与目标对象属性关联的副作用函数并重新执行
                trigger(target, key);
                return result;
            },
        });
        // 标记为响应式对象
        proxy.__v_isReactive = true;
        return proxy;
    }
  ```

## ref 的实现
> ref 用于将基本类型或对象包装为响应式数据。它的底层实现基于 对象访问器（getter/setter）
* 核心逻辑
  1. 包装值：将值包装在一个对象中，通过 .value 访问。
  2. 依赖收集与触发：在 get 中收集依赖，在 set 中触发更新。

* 简化实现
  ```js
    // 对于对象，ref 内部会调用 reactive 将其转换为响应式对象。
    function ref(value) {
        // 如果 value 已经是 ref 对象，直接返回
        if (value && value.__v_isRef) {
            return value;
        }
        // 创建 ref 对象
        const refObject = {
            __v_isRef: true,
            get value() {
                // 依赖收集
                track(refObject, 'value');
                return value;
            },
            set value(newValue) {
                if (newValue !== value) {
                    value = newValue;
                    // 触发依赖更新
                    trigger(refObject, 'value');
                }
            },
        };
        return refObject;
    }

    const targetMap = new WeakMap(); // 存储目标对象与依赖的映射
    function track(target, key) {
        if (activeEffect) {
            let depsMap = targetMap.get(target);
            if (!depsMap) {
                targetMap.set(target, (depsMap = new Map()));
            }
            let dep = depsMap.get(key);
            if (!dep) {
                depsMap.set(key, (dep = new Set()));
            }
            dep.add(activeEffect);
        }
    }
    function trigger(target, key) {
        const depsMap = targetMap.get(target);
        if (depsMap) {
            const dep = depsMap.get(key);
            if (dep) {
                dep.forEach((effect) => effect());
            }
        }
    }
    let activeEffect = null; // 当前正在运行的副作用函数
    function effect(fn) {
        activeEffect = fn;
        fn();
        activeEffect = null;
    }
  ```
