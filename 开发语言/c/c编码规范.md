# c 的编码规范

## 命名约定
* 变量/函数：小写字母 + 下划线，清晰易读
  - int user_count;	
* 宏与枚举常量：大写 + 下划线，区分于普通变量
  - #define MAX_BUF
* 类型 (typedef)：用大驼峰
  - CamelCase
* 全局变量
  - g_ 前缀：int g_running_flag;
* 静态变量
  - 可选 s_ 前缀

## 缩进与格式
  ```c
    // 推荐：K&R 风格（左大括号不换行）
    if (condition) {
        do_something();
    } else {
        do_other();
    }

    // 缩进使用 4 个空格（不要使用 TAB，避免不同编辑器显示混乱）
  ```

## 注释规范
  - 文件头：说明模块功能、作者、日期。
  - 函数注释：描述目的、参数、返回值、注意事项。
  - 复杂逻辑：解释为什么这么做，而不是做了什么（代码本身能说明做了什么）。
  - TODO/FIXME：统一标记并追踪。
  ```c
    /**
     * @brief 计算两个整数的和
     * @param a 第一个加数
     * @param b 第二个加数
     * @return 和
     */
    int add(int a, int b) {
        return a + b;
    }
  ```

## 函数设计
* 单一职责：一个函数只做一件事。
* 长度限制：建议不超过 40～50 行（屏幕一页可见）。
* 参数数量：不超过 4 个，超过则考虑结构体封装。
* 返回值：
  - 返回错误码（0 表示成功，非 0 表示失败）。
  - 返回指针时，确保不为 NULL 并明确所有权。
  - 内联函数：小且频繁调用的函数可用 static inline。
  ```c
    // 良好实践
    int open_config(const char *path, Config *out_cfg);
  ```

## 错误处理
  - 永远不要忽略返回值（printf 除外）。
  - 使用 perror / strerror 报告系统错误。
  - 断言：用于检测不可能发生的情况（调试版本），不用做运行时错误处理。
  ```c
    FILE *fp = fopen("data.txt", "r");
    if (fp == NULL) {
        perror("fopen");
        return -1;
    }

    // 使用 goto 统一错误清理（内核风格）
    int init_device(void) {
        int ret = -1;xs
        void *mem = malloc(1024);
        if (!mem) goto out;
        // ... 其他可能失败的操作
        ret = 0;
    out:
        free(mem);
        return ret;
    }
  ```

## 内存管理
* 谁分配，谁释放：明确每个内存块的所有者。
* 指针使用后置为 NULL 避免野指针。
* 避免内存泄漏：使用 Valgrind 或 AddressSanitizer 检测。
* 栈优先：能放栈上就不放堆上。
* 灵活数组成员：
  ```c
    struct buffer {
        size_t len;
        char data[];  // C99 灵活数组成员
    };
  ```

## 头文件管理
* 包含保护：每个头文件使用 #pragma once 或 #ifndef（推荐 #pragma once，更简洁）。
* 包含顺序：当前模块 .h → C 库 → 第三方库 → 项目内头文件。
* 避免在头文件中定义变量（用 extern 声明，在 .c 中定义）。
  ```c
    #ifndef MODULE_H
    #define MODULE_H

    #include <stddef.h>   // 系统头文件
    #include "common.h"   // 项目头文件

    // 前置声明：减少头文件依赖
    struct context;

    void do_something(struct context *ctx);

    #endif
  ```

## 宏与常量
* 尽量使用 const 或 enum 代替 #define（类型安全、作用域可控）。
* 宏函数必须每个参数加括号：
  ```c
    #define SQUARE(x) ((x) * (x))
  ```
* 宏命名全大写，用下划线分隔。

## 安全性
* 禁止使用 gets()（永远）。
* 使用 strncpy()、snprintf()、memcpy_s()（C11 可选） 代替不安全函数。
* 整数溢出检查（尤其在有符号数和无符号数混用时）。
* 格式化字符串：永远不要用 printf(user_input)，应使用 printf("%s", user_input)。
* 使用编译器防护：-Wall -Wextra -Werror，开启 Stack Protector（-fstack-protector-all）。

## 可移植性
* 使用标准整数类型（<stdint.h>：int32_t, uint16_t 等），避免直接使用 int/long 假设大小。
* 注意大小端：网络序列化时使用 htonl/ntohl 等。
* 避免位域的跨编译器差异（除非严格控制）。
* 路径分隔符：使用 / 或 PATH_SEP 宏。

## 工具与自动化
* clang-tidy	静态分析、检查最佳实践
* cppcheck	静态检查常见错误
* Valgrind / ASAN	内存错误检测
* gcc/clang -Wall	开启所有常用警告