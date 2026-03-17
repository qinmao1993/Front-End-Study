# vue 源码学习（浅析）
## 前置
* flow 
  - 类型推断
  - 类型注释
* Rollup 把源码打包成库
* Object.defineProperty
    ```js
        /*
            obj: 目标对象
            prop: 需要操作的目标对象的属性名
            descriptor: 描述符
            return value 传入对象
        */
        Object.defineProperty(obj, prop, descriptor)
        enumerable，属性是否可枚举，默认 false。
        configurable，属性是否可以被修改或者删除，默认 false。
        get，获取属性的方法。
        set，设置属性的方法。
    ```
* 设计模式:观察者模式（发布订阅），代理模式
## Vue.js 运行机制全局概览
* 初始化
    + new Vue() 之后。 Vue 会调用 _init 函数进行初始化，也就是这里的 init 过程：
    ```js
        Vue.prototype._init = function (options?: Object) {
        // ...
        initLifecycle(vm)    // 生命周期、
        initEvents(vm)       // 事件
        initRender(vm)       // 初始化渲染
        callHook(vm, 'beforeCreate') 
        initInjections(vm)   // resolve injections before data/props
        initState(vm)        // 初始化 props、data、methods、watch、computed 等属性
        initProvide(vm)      // resolve provide after data/props
        callHook(vm, 'created')
        // ...
        }
    ```
  > 其中最重要的是通过 Object.defineProperty 设置 setter 与 getter 函数，用来实现「响应式」以及「依赖收集」

* 编译
    > compile 编译可以分成 parse、optimize 与 generate 三个阶段，最终需要得到 render function。
    - parse：会用正则等方式解析 template 模板中的指令、class、style 等数据，形成 AST（抽象语法树）
    - optimize：主要作用是标记 static 静态节点，这是 Vue 在编译过程中的一处优化，后面当 update 更新界面时，会有一个 patch 的过程， diff 算法会直接跳过静态节点，从而减少了比较的过程，优化了 patch 的性能。
    - generate：将 AST 转化成 render function 字符串的过程，得到结果是 render 的字符串以及 staticRenderFns 字符串。

* 响应式
    - getter 跟 setter 之前介绍过了，在 init 的时候通过 Object.defineProperty 进行了绑定，它使得当被设置的对象被读取的时候会执行 getter 函数，而在当被赋值的时候会执行 setter 函数。
    当 render function 被渲染的时候，因为会读取所需对象的值，所以会触发 getter 函数进行「依赖收集」，「依赖收集」的目的是当你修改值得时候会触发对应的 setter， setter 通知之前「依赖收集」得到的 Dep 中的每一个 Watcher，告诉它们自己的值改变了，需要重新渲染视图。这时候这些 Watcher 就会开始调用 update 来更新视图，当然这中间还有一个 patch 的过程以及使用队列来异步更新的策略

* Virtual DOM
    - Virtual DOM 其实就是一棵以 js 对象（ VNode 节点）作为基础的树，用对象属性来描述节点，最终可以通过一系列操作使这棵树映射到真实环境上。由于 Virtual DOM 是以 js 对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力，比如说浏览器平台、Weex、Node 等。
        ```js
            // 这是简单的例子
            {
                tag: 'div',                 /*说明这是一个div标签*/
                children: [                 /*存放该标签的子节点*/
                    {
                        tag: 'a',           /*说明这是一个a标签*/
                        text: 'click me'    /*标签的内容*/
                    }
                ]
            }
        ```
        ```html
        <!-- 渲染后可以得到 -->
        <div>
            <a>click me</a>
        </div>
       ```
* 更新视图
  - 在修改一个对象值的时候，会通过 setter -> Watcher -> update 的流程来修改对应的视图，那么最终是如何更新视图的呢？
    当数据变化后，执行 render function 就可以得到一个新的 VNode 节点，我们如果想要得到新的视图，最简单粗暴的方法就是直接解析这个新的 VNode 节点，然后用 innerHTML 直接全部渲染到真实 DOM 中。但是其实我们只对其中的一小块内容进行了修改，这样做似乎有些「浪费」。
    这个时候就要介绍我们的「patch」了。我们会将新的  与旧的 VNode 一起传入 patch 进行比较，经过 diff 算法得出它们的「差异」。最后我们只需要将这些「差异」的对应 DOM 进行修改即可。

## 响应式系统原理(核心)
> 如一个对象a传给 vue 实例的 data 属性后，vue 会遍历a的所有属性，并使用 es5 的 Object.defineProperty 把属性转换成 getter/setter 每个组件实例都有watcher实例对象，它会记录这些依赖，某个属性setter改变 watcher 观测到之后 update 通知render 函数重新渲染virtual dom tree
1. 实现 data 数据 observer（可观察的），为了便于理解，我们不考虑数组等复杂的情况，只对对象进行处理
[data-observer](vue-function/data-observer.js)
2. 发现和我们平时改变数据的方式不一样，我们改的时候在实例内直接this.xxx='hello',这里就是用了一个代理
[observer-proxy](vue-function/observer-proxy.js)
1. 为什么要做依赖收集，看下面两个例子
    ```js
    new Vue({
        template: 
            `<div>
                <span>{{text1}}</span> 
                <span>{{text2}}</span> 
            <div>`,
        data: {
            text1: 'text1',
            text2: 'text2',
            text3: 'text3'
        }
    });
    this.text3 = 'modify text3';
    // 视图中并不需要用到 text3 ，所以我们并不需要触发面所讲的 cb 函数来更新视图
    // 假设我们现在有一个全局的对象，我们可能会在多个 Vue 对象中用到它进行展示。
    let globalObj = {
        text1: 'text1'
    };

    let vm1 = new Vue({
        template:
            `<div>
                <span>{{text1}}</span> 
            <div>`,
        data: globalObj
    });

    let vm2 = new Vue({
        template:
            `<div>
                <span>{{text1}}</span> 
            <div>`,
        data: globalObj
    });
    globalObj.text1 = 'hello,text1';

    // 两个vm实例进行视图的更新，「依赖收集」会让 text1 这个数据知道“哦～有两个地方依赖我的数据，我变化的时候需要通知它们”。
    ```
2. 订阅者 Dep
   ```js
       // 首先我们来实现一个订阅者 Dep ，它的主要作用是用来存放 Watcher 观察者对象。
       class Dep {
           constructor () {
               /* 用来存放Watcher对象的数组 */
               this.subs = [];
           }
           /* 在subs中添加一个Watcher对象 */
           addSub (sub) {
               this.subs.push(sub);
           }

           /* 通知所有Watcher对象更新视图 */
           notify () {
               this.subs.forEach(sub => {
                   sub.update();
               })
           }
       }
   ```
3. 观察者 Watcher
    ```js
        class Watcher {
            constructor () {
                /* 在new一个Watcher对象时将该对象赋值给Dep.target，在get中会用到 */
                Dep.target = this;
            }

            /* 更新视图的方法 */
            update () {
                console.log("视图更新啦～");
            }
        }
        Dep.target = null;
    ```
- [dep-collect](vue-function/dep-collect.js)
- [响应式原理](vue-function/响应式原理(完整版).js)

## Virtual Dom
1. 什么是 Virtual Dom？
Virtual DOM 其实就是一棵以 js 对象（VNode 节点）作为基础的树，用对象属性来描述节点，实际上它只是一层对真实 DOM 的抽象。最终可以通过一系列操作使这棵树映射到真实环境上。由于 Virtual DOM 是以 js 对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力，比如说浏览器平台、Weex、Node 等。
2. 定义一个vnode
```js
class VNode {
    constructor (tag, data, children, text, elm) {
        /*当前节点的标签名*/
        this.tag = tag;
        /*当前节点的一些数据信息，比如props、attrs等数据*/
        this.data = data;
        /*当前节点的子节点，是一个数组*/
        this.children = children;
        /*当前节点的文本*/
        this.text = text;
        /*当前虚拟节点对应的真实dom节点*/
        this.elm = elm;
    }
}
// 要js实现下面的组件
<template>
  <span class="demo" v-show="isShow">
    This is a span.
  </span>
</template>

// js 
function render () {
    return new VNode(
        'span',
        {
            /* 指令集合数组 */
            directives: [
                {
                    /* v-show指令 */
                    rawName: 'v-show',
                    expression: 'isShow',
                    name: 'show',
                    value: true
                }
            ],
            /* 静态class */
            staticClass: 'demo'
        },
        [ new VNode(undefined, undefined, undefined, 'This is a span.') ]
    );
}
// js 转换成 vnode
{
    tag: 'span',
    data: {
        /* 指令集合数组 */
        directives: [
            {
                /* v-show指令 */
                rawName: 'v-show',
                expression: 'isShow',
                name: 'show',
                value: true
            }
        ],
        /* 静态class */
        staticClass: 'demo'
    },
    text: undefined,
    children: [
        /* 子节点是一个文本VNode节点 */
        {
            tag: undefined,
            data: undefined,
            text: 'This is a span.',
            children: undefined
        }
    ]
}

// VNode 进一步封装一下，可以实现一些产生常用 VNode 的方法
// 1. 创建空节点
function createEmptyVNode () {
    const node = new VNode();
    node.text = '';
    return node;
}
// 2. 创建文本节点
function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val));
}
// 3. 克隆一个节点
function cloneVNode (node) {
    const cloneVnode = new VNode(
        node.tag,
        node.data,
        node.children,
        node.text,
        node.elm
    );
    return cloneVnode;
}
```

## template 模板编译
```html
 <!-- 以这个例子来学习 -->
<div :class="c" class="demo" v-if="isShow">
    <span v-for="item in sz">{{item}}</span>
</div>
```
1. parse
 - parse 会用正则等方式将 template 模板中进行字符串解析，得到指令、class、style等数据，形成 AST（抽象语法树abstract syntax tree缩写为AST），是源代码的抽象语法结构的树状表现形式得到如下的AST:
    ```js
    {
        /* 标签属性的map，记录了标签上属性 */
        'attrsMap': {
            ':class': 'c',
            'class': 'demo',
            'v-if': 'isShow'
        },
        /* 解析得到的:class */
        'classBinding': 'c',
        /* 标签属性v-if */
        'if': 'isShow',
        /* v-if的条件 */
        'ifConditions': [
            {
                'exp': 'isShow'
            }
        ],
        /* 标签属性class */
        'staticClass': 'demo',
        /* 标签的tag */
        'tag': 'div',
        /* 子标签数组 */
        'children': [
            {
                'attrsMap': {
                    'v-for': "item in sz"
                },
                /* for循环的参数 */
                'alias': "item",
                /* for循环的对象 */
                'for': 'sz',
                /* for循环是否已经被处理的标记位 */
                'forProcessed': true,
                'tag': 'span',
                'children': [
                    {
                        /* 表达式，_s是一个转字符串的函数 */
                        'expression': '_s(item)',
                        'text': '{{item}}'
                    }
                ]
            }
        ]
    }
    // 解析用到的正则
        const ncname = '[a-zA-Z_][\\w\\-\\.]*';
        const singleAttrIdentifier = /([^\s"'<>/=]+)/
        const singleAttrAssign = /(?:=)/
        const singleAttrValues = [
            /"([^"]*)"+/.source,
            /'([^']*)'+/.source,
            /([^\s"'=<>`]+)/.source
        ]
        const attribute = new RegExp(
        '^\\s*' + singleAttrIdentifier.source +
        '(?:\\s*(' + singleAttrAssign.source + ')' +
        '\\s*(?:' + singleAttrValues.join('|') + '))?'
        )

        const qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')'
        const startTagOpen = new RegExp('^<' + qnameCapture)
        const startTagClose = /^\s*(\/?)>/

        const endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>')

        const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g

        const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/

        // 解析 template 采用循环进行字符串匹配的方式，所以每匹配解析完一段我们需要将已经匹配掉的去掉，头部的指针指向接下来需要匹配的部分。

        function advance (n) {
            index += n
            html = html.substring(n)
        }
    ```

2. optimize
> 主要作用就跟它的名字一样，用作「优化」

这个涉及到后面要讲 patch 的过程，因为 patch 的过程实际上是将 VNode 节点进行一层一层的比对，然后将「差异」更新到视图上。那么一些静态节点是不会根据数据变化而产生变化的，这些节点我们没有比对的需求，为了节省一些性能，
为静态的节点做上一些「标记」，在 patch 的时候我们就可以直接跳过这些被标记的节点的比对，从而达到「优化」的目的。

经过 optimize 这层的处理，每个节点会加上 static 属性，用来标记是否是静态的。


3. generate
> generate 会将 AST 转化成 render funtion 字符串，最终得到 render 的字符串以及 staticRenderFns 字符串。
```js
// vue 编译后是这样的
with(this){
    return (isShow) ? 
    _c(
        'div',
        {
            staticClass: "demo",
            class: c
        },
        _l(
            (sz),
            function(item){
                return _c('span',[_v(_s(item))])
            }
        )
    )
    : _e()
}
// 我们把它用 VNode 的形式写出来就会明白了

/* 渲染v-for列表 */
function renderList (val, render) {
    let ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
    }
}

render () {
    return isShow ? (new VNode('div', {
        'staticClass': 'demo',
        'class': c
    }, 
        /* begin */
        renderList(sz, (item) => {
            return new VNode('span', {}, [
                createTextVNode(item);
            ]);
        })
        /* end */
    )) : createEmptyVNode();
}
// 实现一个generate 

// 1. 处理 if 条件的 genIf 函 
function genIf (el) {
    el.ifProcessed = true;
    if (!el.ifConditions.length) {
        return '_e()';
    }
    return `(${el.ifConditions[0].exp})?${genElement(el.ifConditions[0].block)}: _e()`
}

// 2. 处理 for 循环的函数
function genFor (el) {
    el.forProcessed = true;

    const exp = el.for;
    const alias = el.alias;
    const iterator1 = el.iterator1 ? `,${el.iterator1}` : '';
    const iterator2 = el.iterator2 ? `,${el.iterator2}` : '';

    return `_l((${exp}),` +
        `function(${alias}${iterator1}${iterator2}){` +
        `return ${genElement(el)}` +
    '})';
}

// 3. 处理文本节点的函数。
function genText (el) {
    return `_v(${el.expression})`;
}

// 4. genElement这是一个处理节点的函数
function genNode (el) {
    if (el.type === 1) {
        return genElement(el);
    } else {
        return genText(el);
    }
}

function genChildren (el) {
    const children = el.children;

    if (children && children.length > 0) {
        return `${children.map(genNode).join(',')}`;
    }
}

function genElement (el) {
    if (el.if && !el.ifProcessed) {
        return genIf(el);
    } else if (el.for && !el.forProcessed) {
        return genFor(el);
    } else {
        const children = genChildren(el);
        let code;
        code = `_c('${el.tag},'{
            staticClass: ${el.attrsMap && el.attrsMap[':class']},
            class: ${el.attrsMap && el.attrsMap['class']},
        }${
            children ? `,${children}` : ''
        })`
        return code;
    }
}

// 基于以上函数实现了generate 函数
function generate (rootAst) {
    const code = rootAst ? genElement(rootAst) : '_c("div")'
    return {
        render: `with(this){return ${code}}`,
    }
}

```

## 异步更新dom及nextTick
1. 简单的异步更新例子
2. 前置知识：js 运行机制（事件循环）
    > 通过一段代码演示他们的执行顺序：
    ```js
        for (macroTask of macroTaskQueue) {
            // 1. Handle current MACRO-TASK
            handleMacroTask();
            
            // 2. Handle all MICRO-TASK
            for (microTask of microTaskQueue) {
                handleMicroTask(microTask);
            }
        }
    ```
3. Watch 队列。
当某个响应式数据发生变化的时候，它的setter函数会通知闭包中的Dep，Dep则会调用它管理的所有Watch对象。触发Watch对象的update实现。我们来看一下update的实现。
```js
update () {
    /* istanbul ignore else */
    if (this.lazy) {
        this.dirty = true
    } else if (this.sync) {
        /*同步则执行run直接渲染视图*/
        this.run()
    } else {
        /*异步推送到观察者队列中，下一个tick时调用。*/
        queueWatcher(this)
    }
}
 /*将一个观察者对象push进观察者队列，在队列中已经存在相同的id则该观察者对象将被跳过，除非它是在队列被刷新时推送*/
export function queueWatcher (watcher: Watcher) {
  /*获取watcher的id*/
  const id = watcher.id
  /*检验id是否存在，已经存在则直接跳过，不存在则标记哈希表has，用于下次检验*/
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      /*如果没有flush掉，直接push到队列中即可*/
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i >= 0 && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
```
4. nextTick 
    - 目的:执行的目的是在 microtask 或者task中推入一个 function，在当前栈执行完毕（也许还会有一些排在前面的需要执行的任务）以后执行 nextTick传入的 function
    - 它是一个立即执行函数,返回一个queueNextTick接口。

    传入的cb会被push进callbacks中存放起来，然后执行timerFunc（pending是一个状态标记，保证timerFunc在下一个tick之前只执行一次）。
    timerFunc是什么？
    timerFunc会检测当前环境而不同实现，其实就是按照 Promise，MutationObserver，setTimeout优先级，哪个存在使用哪个，最不济的环境下使用setTimeout。

5. 异步更新的原因:
 - 每次++时，都会根据响应式触发setter->Dep->Watcher->update->patch。 如果这时候没有异步更新视图，那么每次++都会直接操作DOM更新视图，这是非常消耗性能的。 所以Vue.js实现了一个queue队列，在下一个tick的时候会统一执行queue中Watcher的run。同时，拥有相同id的Watcher不会被重复加入到该queue中去，所以不会执行1000次Watcher的run。最终更新视图只会直接将test对应的DOM的0变成1000。 保证更新视图操作DOM的动作是在当前栈执行完以后下一个tick的时候调用，大大优化了性能。
 
## 拓展

## vue-router
## vuex
## 参考链接
- https://juejin.im/book/5a36661851882538e2259c0f/section/5a37bbb35188257d167a4d64
- https://github.com/answershuto/learnVue
- https://ustbhuangyi.github.io/vue-analysis/
- http://hcysun.me/vue-design/art/1start-learn.html