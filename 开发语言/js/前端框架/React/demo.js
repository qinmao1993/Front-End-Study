import {
    useState,
    useRef,
    createContext,
    useContext,
    useEffect,
    useMemo,
} from "react";

function ToDoList() {
    // 列表渲染: map|filter
    // 条件渲染: if|&&|?:
    // 事件绑定
    // 获取dom: ref
    const [list, setList] = useState([]);
    const [show, setShow] = useState(false);

    const wrapperRef = useRef(null);

    useEffect(() => {
        // 依赖项空数组，组件初始渲染时执行一次
        function getList() {
            const list = [
                { name: "张三", id: 23 },
                { name: "李四", id: 25 },
            ];
            // 模拟异步请求
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(list);
                }, 500);
            });
        }
        getList().then((newlist) => {
            setList(newlist);
        });
    }, []);

    function handleAdd() {
        console.log("ref 获取到 dom 元素:", wrapperRef.current);
        // 数组的改变:增加,要用新值替换它
        setList([...list, { name: "张4", id: uuidv4() }]);
    }

    function handleEdit(id) {
        // 数组的改变:修改其中的一项
        const newList = list.map((item) => {
            if (item.id === id) {
                item.name = "ggg";
            }
            return item;
        });
        setList(newList);

        // // 对象改变:
        // // ... 展开语法本质是是“浅拷贝”——它只会复制一层
        // setPerson({
        //   ...person,
        //   name: "test",
        // });

        // // 对象的嵌套层属性改变
        // setPerson({
        //   ...person,
        //   artwork: {
        //     ...person.artwork,
        //     title: "test-title",
        //   },
        // });
    }

    function handleDelete(id) {
        setList(list.filter((item) => item.id !== id));
    }

    function TestDemo() {
        return <div>TestDemo</div>;
    }
    return (
        <div ref={wrapperRef}>
            <button onClick={handleAdd}>添加</button>
            <ul>
                {list.map((item) => {
                    if (item.id > 23) {
                        return (
                            <li
                                key={item.id}
                                name={item.name + "_" + item.id}
                                className="test"
                            >
                                <span> {item.name}</span>
                                <button onClick={() => handleDelete(item.id)}>
                                    删除
                                </button>
                                <button onClick={() => handleEdit(item.id)}>
                                    修改名字
                                </button>
                            </li>
                        );
                    } else {
                        return (
                            <li key={item.id} name={item.name} className="test">
                                <span> {item.name}</span>
                                <button onClick={() => handleDelete(item.id)}>
                                    删除
                                </button>
                            </li>
                        );
                    }
                })}
            </ul>
            {show && <TestDemo></TestDemo>}
        </div>
    );
}

function MyDemo() {
    const { count } = useSelector((state) => state.counter);
    const dispatch = useDispatch();

    // useEffect(() => {
    //   // 组件渲染完后执行异步操作
    //   dispatch(incrementAsync(10));
    // }, [dispatch]);

    return (
        <div>
            <div>
                <button onClick={() => setShow(false)}>卸载子组件</button>
            </div>
            <div>
                <h2>redux</h2>
                <button onClick={() => dispatch(decrement())}>-</button>
                <span>{count}</span>
                <button onClick={() => dispatch(increment())}>+</button>
                <br />
                <button onClick={() => dispatch(incrementByAmount(5))}>
                    同步 +5
                </button>
                <button onClick={() => dispatch(incrementAsync(10))}>
                    异步 +10
                </button>
            </div>
        </div>
    );
}
