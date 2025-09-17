// tests.mjs
import assert from "node:assert";
import {
    test,
    describe,
    it,
    before,
    after,
    beforeEach,
    afterEach,
} from "node:test";

// // 同步测试
// test("同步测试应通过", (t) => {
//     assert.strictEqual(1, 1);
// });

// test("同步失败测试", (t) => {
//     assert.strictEqual(1, 2); // 失败并抛出异常
// });

// // 异步测试
// test("异步测试应通过", async (t) => {
//     const result = await Promise.resolve(1);
//     assert.strictEqual(result, 1);
// });

// test("回调测试", (t, done) => {
//     setTimeout(() => {
//         try {
//             assert.strictEqual(1, 1);
//             done(); // 无错误表示测试通过
//         } catch (err) {
//             done(err); // 传递错误表示测试失败
//         }
//     }, 100);
// });

// // describe 来创建测试套件，用 it 来定义测试用例（it 是 test 的别名）
// describe("数学运算", () => {
//     describe("加法", () => {
//         it("应正确计算正数加法", () => {
//             assert.strictEqual(1 + 1, 2);
//         });

//         it("应正确处理负数加法", () => {
//             assert.strictEqual(-1 + 1, 0);
//         });
//     });

//     describe("减法", () => {
//         it("应正确计算减法", () => {
//             assert.strictEqual(3 - 1, 2);
//         });
//     });
// });

// 生命周期钩子：
// 可以使用 beforeAll, afterAll, beforeEach, afterEach 来设置测试前后需要执行的操作
// beforeAll(() => {
//     // 在所有测试之前执行
// });

// afterAll(() => {
//     // 在所有测试之后执行
// });

// beforeEach(() => {
//     // 在每个测试之前执行
// });

// afterEach(() => {
//     // 在每个测试之后执行
// });

// 假设我们有一个简单的数学模块
const MathUtils = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    divide: (a, b) => {
        if (b === 0) {
            throw new Error("除数不能为零");
        }
        return a / b;
    },
    multiply: (a, b) => a * b,
};

describe("数学工具库", () => {
    before(() => {
        console.log("开始运行数学工具库测试套件");
    });

    describe("加法运算", () => {
        it("应正确相加正数", () => {
            assert.strictEqual(MathUtils.add(2, 3), 5);
        });

        it("应正确相加负数", () => {
            assert.strictEqual(MathUtils.add(-1, -2), -3);
        });

        it("应正确处理零", () => {
            assert.strictEqual(MathUtils.add(0, 5), 5);
        });
    });

    describe("除法运算", () => {
        it("应正确进行除法运算", () => {
            assert.strictEqual(MathUtils.divide(10, 2), 5);
        });

        it("除零时应抛出错误", () => {
            assert.throws(() => MathUtils.divide(10, 0), /除数不能为零/);
        });
    });

    // 动态跳过测试的例子
    it("乘法测试暂未实现", { skip: "等待实现" }, (t) => {
        // 待实现
    });
});

// run with `node tests.mjs`
// 或者使用 `node --test` 来运行所有测试文件
// node --test test_example.mjs # 运行指定测试文件

// node --test --test-reporter=html test_example.mjs # 生成 HTML 格式的测试报告

// node --test-name-pattern="加法" test_example.mjs # 只运行描述中包含“加法”的测试
// node --test-name-pattern="test[1-3]" test_example.mjs # 只运行匹配 test1, test2, test3 的测试

// node --experimental-test-coverage --test tests.mjs # 启用测试覆盖率
