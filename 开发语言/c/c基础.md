# C 基础
> c语言是编译型语言，必须先用编译器（如 GCC、Clang）将 .c 源文件编译成机器码的可执行文件，然后再运行。流程如编写源码（.c）->编译（gcc main.c -o myprogram）->运行（./myprogram）

## 对比其他语言
* C 没有“运行时环境”帮你兜底，任何内存越界、空指针访问都可能导致程序崩溃（Segmentation Fault）或未定义行为，而不是抛出友好的 TypeError。
* C 程序从 main() 函数开始执行，不像 JS 模块顶层代码直接运行。

## C语言特点
* 简洁与结构化
* 高效与可移植
* 指针——灵魂所在
  - 通过指针，你可以直接访问和操作内存：
* 手动内存管理
* 丰富的运算符
* 预处理指令

## 应用场景
* 无可撼动的基石：操作系统（如Linux内核）、数据库系统（如MySQL）、嵌入式系统和设备驱动程序等领域，C语言依然是绝对的主导，是构建整个数字世界的基石。
* 性能核心：在高性能计算、游戏引擎核心和实时系统中，C语言是保证极致性能的首选。
* 工业界的常青树：根据TIOBE编程语言排行榜（2026年4月），C语言的市场热度稳居第二位，占比高达12.34%。

## C语言标准演进
> c 语言是一门不断发展的语言，标准不断添加新特性
* c89（c90） -> c99 -> c11 -> c17 ->C23（2023）

## 开发环境配置
> 学习一门语言首先需要一个运行环境，c语言是编译型语言，需要安装编译器
* 编译器安装
  + mac
    - 方案一：mac默认安装了 Clang 编译器，对标准的支持更好
    ```bash
        # 检查
        clang -v
        xcode-select --install # 不存在安装
    ```
    - 方案二：安装GCC
    ```bash
        # 注意：在 mac 上系统自带的 gcc 和 g++ 命令可能实际指向 Clang。要使用真正的 GCC，需安装后使用 gcc-版本号 命令
        brew install gcc
    ```
  + windows
    > Windows 系统本身不带C编译器，但有两个主流选择：轻量级的 MinGW-w64 (GCC) 和功能强大的 Visual Studio (MSVC)。
    + 方案一：MinGW-w64 (推荐初学者)
      - 它是在Windows上模拟Linux下GCC的工具集，轻量、开源，能让你使用熟悉的 gcc 命令
      - [下载](https://www.mingw-w64.org/)
      + 配置环境变量：这是为了让系统知道 gcc 命令在哪。
        - 右键“此电脑” -> “属性” -> “高级系统设置” -> “环境变量”
        - 在“系统变量”中找到 Path，双击并“新建”，填入MinGW安装目录下的 bin 文件夹路径（例如 C:\mingw64\bin），然后一路“确定”保存
        - 验证安装:打开命令提示符（CMD），输入 gcc --version
    + 方案二:Visual Studio (MSVC)
      - 下载：访问Visual Studio官网，下载免费的Community版本
      - 安装：运行安装程序，在“工作负载”选项卡中，务必勾选“使用C++的桌面开发”。这会安装MSVC编译器及Windows开发所需的SDK和库
      - 使用：安装完成后，从开始菜单打开“Developer Command Prompt for VS”，在此命令行窗口中可以使用 cl 命令来编译C程序。
  + linux
    - GCC（开源跨平台编译器）
    ```bash
        # Debian/Ubuntu
        sudo apt update
        sudo apt install build-essential

        # Fedora/CentOS/RHEL
        sudo dnf groupinstall "Development Tools"
    ```
* gcc 常用命令
  ```bash
    # 编译 hello.c 文件，默认会在当前目录下生成一个编译产物文件 a.out
    # 执行该文件，就会在屏幕上输出 Hello World。
    gcc hello.c

    # -o参数（output 的缩写）可以指定编译产物的文件名。
    gcc hello.c -o hello

    # GCC 的-std=参数（standard 的缩写）还可以指定按照哪个 C 语言的标准进行编译。
    gcc -std=c17 hello.c
    
    # 编译并运行，
    # -Wall”，让编译器明确指出程序代码中存在的所有语法使用不恰当的地方。
    gcc demo.c -o demo -Wall && ./demo
   ```
* 调试器
  - LLDB：通常与 LLVM/Clang 配套，是 mac上的默认调试器
  - GDB（命令行）或 VS Code 的调试插件
* [1_vscode配置](./vscode配置.md)
* [2_构建工具](make、cmake.md)

## 入门程序
  ```c
    // #include 预处理器指令，将 stdio.h 文件中的内容包含在当前程序中,称为头文件,作用：声明接口，隐藏实现
    // stdio.h 是c标准库部分，提供键盘输入和屏幕输出的支持，printf函数来自stdio.h
    #include <stdio.h>  
    // 是c语言的入口函数
    int main()
    {
        printf("Hello, World! \n");
        return 0;
    }
  ```

## 如何理解头文件?（对比其他的语言如js）
> 表面上看，C 语言的 #include "head.h" 和 JS 的 import ... from './module.js' 都是在“引入外部代码”，但它们的底层实现机制和工作原理完全不同
* 头文件主要作用
  - 声明接口，隐藏实现
  - 促进代码复用,组织大型项目
  - 保证一致性

* 为什么这样设计？
  1. 早期机器内存很小，只有64KB ~ 256KB。编译器根本没有能力一次性把整个项目的所有源文件读进内存里进行“全局分析”。这就决定了 C 语言必须采用独立编译模型：把大项目拆成一个个 .c 文件，编译器一次只编译一个 .c 文件，生成对应的 .o 目标文件。最后再由链接器把这些 .o 文件像拼图一样拼成一个完整的可执行文件。这就导致了下面的问题
  2. 独立编译时如何知道“外部世界”的存在？假设项目有两个文件：
    ```c
        // math.c (提供加法功能)：
        int add(int a, int b) {
            return a + b;
        }
        // main.c 文件 (调用加法功能)：
        int main() {
            int sum = add(1, 2); // 注意：这里调用了另一个文件里的函数
            return 0;
        }
    ```
  + 从编译器视角
    - “我正在编译 main.c，我看到第 2 行调用了 add 函数。add 是什么？它在这个文件里没有定义。它有几个参数？返回什么类型？我不知道。我必须现在就知道这些信息，才能生成正确的机器码（比如参数怎么压栈、返回值放哪个寄存器）。”
  + JS 引擎是怎么做的？
    - JS 引擎是运行时加载模块。执行到 import { add } from './math.js' 时，引擎会暂停，去文件系统读取 math.js，解析它，拿到 add 的定义，然后再继续执行。这是因为它有整个运行时环境（V8 引擎）做支撑，内存也足够大。
  + C 编译器是怎么做的？
    - C 编译器是一个离线工具，它运行在编译时，不是在运行时。它不能“暂停一下，我去读一下 math.c 看看 add 长什么样”。而且由于内存限制，它也不可能把 math.c 和 main.c 同时加载进来对比。
  + 解决方案：人为给编译器一份“接口说明书” 
    - 既然编译器无法自己去探索外部函数的信息，那就需要程序员在编译 main.c 之前，手动把 add 函数的“模样”（即函数声明）告诉编译器。这份“接口说明书”就是头文件。所以程序员创建一个 math.h
    ```c
        // math.h
        int add(int a, int b);  // 这是“承诺”：有一个叫 add 的函数，它接收两个 int，返回 int

        // 然后在 main.c 开头写：
        #include "math.h"  // 把说明书的内容贴在这里
        int main() {
            int sum = add(1, 2);  // 编译器检查：嗯，调用方式符合说明书，放行！
            return 0;
        }
    ```
    - 编译器此时依然不知道 add 函数的具体实现（机器码）在哪里，它只知道“调用格式”。它会在生成的 main.o 文件中留一个空位，写着：“此处需要函数 add，请链接器帮忙填上地址”。
  + 链接器：最后的拼图
    - main.o 里面是 main 函数的机器码，以及对 add 的一个未解决引用。 math.o 里面是 add 函数的机器码，并导出一个符号 add。
    - 链接器把 main.o 和 math.o 拼在一起，然后把 main.o 中对 add 的调用地址修正为 math.o 中 add 的实际地址。最终生成一个完整的可执行文件。
  + 为什么 C 语言不改成现代模块系统？
    - 向后兼容性：全世界有数百亿行 C 代码（操作系统内核、嵌入式设备、基础库）依赖这种模型。改变意味着整个数字世界的基础设施重写。
    - 零开销原则：C 语言的核心哲学是 “不为用不到的东西付出代价” 。#include 文本展开后，函数调用就是一条简单的 call 指令，没有任何中间层。这对系统级编程至关重要。

* 头文件的最佳实践
  - 包含防护（Include Guards）:防止头文件被多次包含导致的重复定义错误。
   ```c
    // math_utils.h
    #ifndef MATH_UTILS_H  // 如果没有定义MATH_UTILS_H
    #define MATH_UTILS_H  // 定义MATH_UTILS_H
    // 头文件内容
    int add(int a, int b);
    #endif // MATH_UTILS_H
   ```
  - 仅包含必要的内容:避免形成复杂的包含依赖关系。
  ```c
    // 正确：只包含需要的头文件
    #include <stdio.h>
    #include "math_utils.h"
  ```

## c语言中的包管理器
> 因为C语言的“头文件+库文件”分离模式让统一管理变得复杂。不同操作系统和编译器对二进制接口（ABI）的定义各不相同，这让一个能“一处编译，处处运行”的通用包管理器很难实现，因此才催生了众多解决方案。
* 主流工具
  - vcpkg: 微软开发的开源C/C++库管理器，强调易用和IDE集成。主要在Windows/VS开发，希望开箱即用、一键安装库的开发者。
  - Conan: 功能最强大的C/C++包管理器之一，支持所有主流平台和编译器,中大型项目、专业团队，需要精细控制依赖和解决复杂版本冲突。
* vcpkg（推荐）
  + 核心概念
    - “源码构建”哲学 (Source-Based)：与 npm 直接下载预编译的二进制包不同，vcpkg 的核心模式是从源码开始，在你的机器上当场编译所有库。这能确保库与你的编译器、系统环境完美兼容。
    - “三元组” (Triplet)：这是一个用于精确描述目标环境的标识符，格式为 <架构>-<系统>-<链接方式>。例如，x64-osx 代表 macOS 64位系统（默认静态链接），而 arm64-osx 则代表 Apple Silicon Mac。在安装包时通过 : 指定，如 vcpkg install fmt:x64-osx。
    - “端口” (Port)：可以把它理解为一个“构建配方”，一个包含如何下载、打补丁、编译特定库的脚本。官方维护了超过 2300 个高质量的开源库端口。
  + 安装 (macOS)
    1. 克隆仓库：git clone https://github.com/microsoft/vcpkg.git
    2. 进入目录：cd vcpkg
    3. 运行安装脚本：./bootstrap-vcpkg.sh
    4. 设置环境变量可选
      ```bash
        # 用你实际的vcpkg路径替换 /path/to/vcpkg
        echo 'export PATH="/path/to/vcpkg:$PATH"' >> ~/.zshrc
        source ~/.zshrc
      ```
  + 两种工作模式
    + 经典模式:
      - 直接的“命令行驱动”模式,通过 vcpkg install 安装的库会集中存放在 vcpkg 的安装目录下，所有项目共享
      - 经典模式的集成
       ```bash
        cmake -B build -S . -DCMAKE_TOOLCHAIN_FILE=[你的vcpkg路径]/scripts/buildsystems/vcpkg.cmake
       ```
    + 清单模式（推荐）:将项目的所有直接依赖声明在一个 vcpkg.json 文件中。这个文件应被纳入版本控制（如 Git），确保团队中任何成员只需克隆项目，依赖就会被自动管理。适合团队协作和正式项目。
    1. 在项目根目录创建 vcpkg.json：
      ```json
        {
            "name": "my-c-project",
            "version": "0.1.0",
            "dependencies": [
                "fmt",
                "sqlite3"
            ]
        }
      ```
    2. 在 CMake 配置阶段自动安装：当你用正确的 CMake 指令配置项目时，vcpkg 会读取此文件，并自动在项目本地的 vcpkg_installed 目录下安装依赖，实现了项目间的环境隔离。
  + 常用命令
    ```bash
    vcpkg search fmt
    vcpkg install fmt
    vcpkg list
    # 更新 vcpkg 自身
    git pull
    # 升级已安装的库
    vcpkg upgrade
    ```
  + 使用示例（以SQLite为例）
    1. 安装库：vcpkg install sqlite3
    2. 与 CMake 集成，无论使用哪种模式，最终都需要让 CMake 找到并链接这些库。
      ```cmake
        cmake_minimum_required(VERSION 3.10)
        project(MyApp C)

        find_package(SQLite3 REQUIRED)  # 通用的：vcpkg会帮你找到这个库

        add_executable(myapp main.c)

        target_link_libraries(myapp PRIVATE SQLite::SQLite3)
        # 多个库
        # target_link_libraries(my_app PRIVATE fmt::fmt SQLite::SQLite3)
      ```
    3. 清单模式的集成:只需在 CMakeLists.txt 中正常使用 find_package 和 target_link_libraries，然后执行 vcpkg 项目专用的 CMake 配置命令。vcpkg 会自动介入处理依赖。
      ```bash
        # 在项目根目录执行
        cmake --preset=default
      ```

## C语言的编译过程
1. 预处理
  - 宏定义展开
  - 头文件展开
  - 条件编译
  - 删除注释
2. 编译
  - 检查语法
  - 将预处理后的文件编译成汇编文件
3. 汇编
  - 编译器会将这些汇编代码编译成具有一定格式，可以被操作系统使用的某种对象文件格式。
4. 链接
  - 通过链接处理，编译器会将所有程序目前需要的对象文件进行整合、设置好程序中所有调用函数的正确地址，并生成对应的二进制可执行文件。
![完整编译过程](./imgs/c语言编译过程.png)

## 数据类型
### 基础数据类型
* char 字符数据类型
  - 大小为1个字节，-128~127,类似js中 String 单个字符（但其实是整数），常用作字符或小整数
  ```c
    // 只要在字符类型的范围之内，整数与字符是可以互换的，都可以赋值给字符类型的变量。
    //  C 语言规定，单引号中的单个字符表示字符常量
    char a = 'B'; // 等同于 char a = 66;
    char b = 'C'; // 等同于 char b = 67;
    printf("%d\n", a + b); // 输出 133

    // 单引号本身也是一个字符，如果要表示这个字符常量，必须使用反斜杠转义。
    char t = '\'';

    // 四种写法都是等价的。
    char x = 'B';
    char x = 66;
    char x = '\102'; // 八进制
    char x = '\x42'; // 十六进制
  ```
* 整数类型
  + 标准有符号整型（按宽度递增）取决于平台
    - short int（简写为short） 2字节（整数范围为-32768～32767) 
    - int 4 字节 -32767 ~ 32767（实际更大）最常用的整型,一般整数运算，除非有特殊需求。
    - long int（简写为long）：-2147483647 ~ 2147483647 4或8字节，（如文件大小、时间戳）
    - long long int（简写为long long）：至少为8个字节。-2147483647 ~ 2147483647
    - signed:有正负号，包含负值
    - unsigned:不带有正负号，只能表示零和正整数,好处是同样长度的内存能够表示的更大的整数值。常见使用 size_t 更佳
  + 固定宽度整型（<stdint.h>, C99）
    > 这些类型提供精确的位宽，适合跨平台、网络协议、二进制文件结构、嵌入式硬件寄存器 等场景。
    - int8_t, uint8_t   原始字节、ASCII 字符、传感器值（-128~127 或 0~255）
    - int16_t, uint16_t 网络端口号（TCP/UDP）、PCM 音频样本、工业 Modbus 寄存器
    - int32_t, uint32_t Unix 时间戳（秒）、IPv4 地址（按整数存储）、CRC32 校验值
    - int64_t, uint64_t 文件大小（超过 4GB）、高精度计时（纳秒）、哈希（如 xxHash）、数据库行 ID
  + 环境相关的类型（<stddef.h>, <stdint.h> 等）
    - size_t	无符号，strlen，sizeof的返回值类型，数组索引或内存大小，
    - ptrdiff_t 有符号，两个指针相减的结果	
    - intptr_t / uintptr_t	足以存储指针的整数
  + 特殊整型：_Bool (C99) / bool（需要 <stdbool.h>）
    - 大小：至少 1 字节（实际通常 1 字节），只能存储 0 或 1。
    ```c
        // 头文件定义了另一个类型别名bool，并且定义了true代表1、false代表0。
        #include <stdbool.h>
        bool flag = false;

        _Bool isNormal;
        isNormal = 1;
        if (isNormal)
        printf("Everything is OK.\n");
        ```
* float|double|long double （表示带小数点的数）
    - float 单精度浮点，精度约 7 位有效数字 占用4个字节。
    - double 双精度浮点数，占用8个字节，至少提供13位有效数字。
    - long double 通常占用16个字节。
* 类型大小检测：sizeof
  - 同一个C程序在不同平台上编译时，如 int 的大小可能不同，应使用 sizeof(int) 来了解当前平台的情况
  - 以字节为单位输出指定类型的的大小 如 sizeof(int)、sizeof(float)
* 无符号和有符号整数是如何存储的，什么是补码？
  > 在计算机中，整数分为无符号整数和有符号整数，它们的存储方式都基于二进制位
  + 无符号整数的存储
    - 使用所有位直接表示数值的大小，没有符号位。存储的是该数的二进制原码（即直接转换）。
    - 示例：42 的存储,42 的二进制是 0010 1010（8 位）。内存中就是：00101010。
  + 有符号整数的存储：补码（Two's Complement）
    - 正数：补码 = 原码（符号位 0，其余位为绝对值）。
    - 负数：补码 = 对其绝对值的二进制表示取反（按位取反）再加 1。补码是通过“模运算”把负数转成对应的正数，让减法可以用加法完成。

### 字符串
> C语言没有单独的字符串类型，字符串被当作char类型的数组，用双引号包裹表示，以 空字符 \0 结尾。
* 字符串变量的声明
  ```c
    // 声明了一个10个成员的字符数组，可以当作字符串。由于必须留一个位置给\0，所以最多只能容纳9个字符的字符串。
    char localString[10];
    // 字符串写成数组的形式，是非常麻烦的。可简写成用双引号包裹表示的字符，会被自动视为字符数组。
    {'H', 'e', 'l', 'l', 'o', '\0'}     // 等价于  "Hello"
    char s[] = "Hello, world!";  // 定义了一个字符串s
    const char* s = "Hello, world!"; // 指针内容详细介绍
  ``` 
* 字符串常用函数
  + 输出：putchar|puts|fputs|printf
    - putchar 把字符输出到屏幕，等同于使用printf输出一个字符
    ```c
        puts("Hello World"); // 将参数字符串显示在屏幕（stdout）上，并且自动在字符串末尾添加换行符
        
        char line[81];
        while(fgets(line,81,stdin)){
            fputs(line,stdout)  // fputs 是puts针对文件的定制版，第二个参数是写入数据的文件，不会在末尾加换行
        }
    ```
  + 输入：getchar
      - 返回用户从键盘输入的一个字符，使用时不带有任何参数。程序运行到这个命令就会暂停，等待用户从键盘输入，等同于使用scanf()方法读取一个字符
      - 不会忽略起首的空白字符，总是返回当前读取的第一个字符
      - 读取失败，返回常量 EOF，由于 EOF 通常是-1，所以返回值的类型要设为 int，而不是 char。
  + 获取字符串的长度: strlen
    - 返回字符串的字节长度，不包括末尾的空字符\0
      ```c
        #include <stdio.h>
        #include <string.h>
        int main(void) {
            char s[] = "Hello, world!";
            printf("The string is %zd characters long.\n", strlen(s));
        }
      ```
  + 复制：strcpy|strncpy
    - strcpy 用于将一个字符串的内容复制到另一个字符串。有安全风险，因为它并不检查目标字符串的长度，是否足够容纳源字符串的副本，可能导致写入溢出
    - 如果不能保证不会发生溢出，建议使用 strncpy() 函数代替。
    ```c
        #include <stdio.h>
        #include <string.h>
        int main(void) {
            char s[] = "Hello, world!";
            char t[100];

            strcpy(t, s);

            t[0] = 'z';
            printf("%s\n", s);  // "Hello, world!"
            printf("%s\n", t);  // "zello, world!"
        }
    ```
  + 连接字符串：strcat|strncat
    - 注意 strcat() 的第一个参数的长度，必须足以容纳添加第二个参数字符串。否则，拼接后的字符串会溢出第一个字符串的边界，写入相邻的内存单元，这是很危险的，建议使用下面的 strncat() 代替。
    ```c
        char s1[12] = "hello";
        char s2[6] = "world";

        strcat(s1, s2);
        puts(s1); // "helloworld"
    ```

### 常量
  ```c
   #include <stdio.h>  
   #define MAX 100

   int main()
    {
        printf("常量 MAX 为%d \n",MAX);
        // const c90 新增了限定符 表示只读
        const int num=9;
        return 0;
    }
  ```

### 数组
> 是一块连续的同类型内存区域。数组大小在编译时确定，没有 .length 属性，需要自己维护长度。
* 声明和赋值
  ```c
    // 声明时赋值，数组赋值之后，再用大括号修改值，是不允许的
    int a[5] = {22, 37, 3490, 18, 95};
    // 数组初始化时，可以指定为哪些位置的成员赋值，其他位置的值都自动设为0。
    int a[15] = {[2] = 29, [9] = 7, [14] = 48};

    // 可省略方括号里面的数组成员数量
    int a[] = {22, 37}; // 等同于 int a[2] = {22, 37};

    int a[] = {22, 37, 3490};
    // len 数组的成员数量
    int len= sizeof(a) / sizeof(a[0])
  ```
* 数组复制
  ```c
    // 1. 数组元素逐个进行复制。
    for (i = 0; i < N; i++)
    a[i] = b[i];

    // 2. 使用 memcpy()函数（定义在头文件 string.h），直接把数组所在的那一段内存，再复制一份。
    // 将数组 b 所在的那段内存，复制给数组a。这种方法要比循环复制数组成员要快。
    memcpy(a, b, sizeof(b));
   ```

### 指针
> 指针就是存储内存地址的变量。 用字符 * 表示指针，通常跟在类型关键字的后面，表示指针指向的是什么类型的值
* 指针声明
  ```c
    // 声明指针变量之后，编译器会为指针变量本身分配一个内存空间，这个内存空间里面的值是随机的
    int a = 10;
    int *p = &a;   // p 存储 a 的地址
    *p = 20;       // 通过 p 修改 a 的值
  ```
* (*|&)运算符
  - *除了表示指针以外，还可作运算符，用来取出指针变量所指向的内存地址里面的值
  - &运算符用来取出一个变量所在的内存地址。
  ```c
    void increment(int* p) {
      *p = *p + 1;
    }
    // & 运算符与 * 运算符互为逆运算
    int x = 1;
    increment(&x);
    printf("%d\n", x); // 2
* 指针的操作
  - 共有8种操作
  ```c
    // 1.赋值
    int * p;
    int i=8;
    p = &i;

    // 2.解引用
    printf("*p=%d",*p) // 8

    // 3.取址
    printf("*p=p",p) // 0x7ff7bfefef5c 

    // 4.指针与整数相加/ 指针减去一个整数
    short* j;
    j = j + 1;  // 表示指针向内存地址的高位移动一个单位，而一个单位的short类型占据2个字节的宽度，所以相当于向高位移动两个字节

    int arr[]={1,2,3,4};
    int * p1=arr;
    p1+2 == &arr[2];

    // 5.递增指针/递减指针
    // 指针指向下一个元素的地址，如p1++ 等于 &arr[1],同理 p2-- 等于arr[0]
    
    // 6.指针求差，通常指 指定同一数组的不同元素，计算两元素之间的距离，差值单位就是数组的类型   
    // 如 p2-p1 =2 指p2与p1 相距2个int
  ```
* 指针与字符串
  ```c
    char* s = "Hello, world!";
    // 1. 指针指向的字符串，在 C 语言内部被当作常量，不能修改字符串本身。加 const 提醒用户字符串声明为指针后不能修改
    const char* s = "Hello, world!"; 
    s[0] = 'z'; // 错误

    // 数组声明字符串变量，可以修改数组的任意成员,
    char s[] = "Hello, world!";
    s[0] = 'z'; // 正确

    // 2. 指针变量可以指向其它字符串。字符数组变量不能指向另一个字符串。
    char* s = "hello";
    s = "world";

    char s[] = "hello";
    s = "world"; // 报错
    
    // 同理，声明字符数组后，不能直接用字符串赋值。
    char s[10];
    s = "abc"; // 错误

    // 想要重新赋值，必须使用 C 语言原生提供的 strcpy()函数，通过字符串拷贝完成赋值
    char s[10];
    strcpy(s, "abc");
  ```
* 数组和指针的关系
  ```c
    int a[5] = {11, 22, 33, 44, 55};
    int* p = &a[0];
    // 写法一
    int sum(int arr[], int len);
    // 写法二
    int sum(int* arr, int len);
  ```

### 结构体联合枚举
> C 用 struct 将多个不同类型的数据组合成一个新类型。
* struct(结构体)
  - 声明与赋值：结构体是值类型，赋值时会复制整个结构体的内容
   ```c
    // 方式一：注意结尾分好不能省略
    struct fraction {
        int numerator;
        int denominator;
    };
    struct fraction f1;
    f1.numerator = 22;
    f1.denominator = 7;

    // 方式二： 一次性对 struct 结构的所有属性赋值
    struct car {
        char* name;
        float price;
        int speed;
    };
    struct car saturn = { "Saturn SL/2", 16000.99, 175 };

    // 方式三：声明变量的同时，对变量赋值。
    struct {
        char title[500];
        char author[100];
        float value;
    } b1 = {"Harry Potter", "J. K. Rowling", 10.0},
    b2 = {"Cancer Ward", "Aleksandr Solzhenitsyn", 7.85};

  ```
  + 结构体的存储空间
    - struct 结构占用的存储空间，不是各个属性存储空间的总和，而是最大内存占用属性的存储空间的倍数，其他属性会添加空位与之对齐。
    - 目的：是为了加快读写速度，把内存占用划分成等长的区块，就可以快速在 Struct 结构体中定位到每个属性的起始地址。
  - struct 的嵌套
    ```c
        struct species {
            char* name;
            int kinds;
        };

        struct fish {
            char* name;
            int age;
            struct species breed;
        };
    // 写法一
    struct fish shark = {"shark", 9, {"Selachimorpha", 500}};
    // 写法二
    struct species myBreed = {"Selachimorpha", 500};
    struct fish shark = {"shark", 9, myBreed};
    // 写法三
    struct fish shark = {
        .name="shark",
        .age=9,
        .breed={"Selachimorpha", 500}
        
        // .breed.name="Selachimorpha",
        // .breed.kinds=500
    };
    printf("Shark's species is %s", shark.breed.name);

    ```
  - 位字段：用来定义二进制位组成的数据结构，这对于操作底层的二进制数据非常有用
   ```c
    struct {
        unsigned int ab:1;
        unsigned int cd:1;
        unsigned int ef:1;
        unsigned int gh:1;
    } synth;

    synth.ab = 0;
    synth.cd = 1;
    // 每个属性后面的:1，表示指定这些属性只占用一个二进制位，所以这个数据结构一共是4个二进制位。
    // 注意，定义二进制位时，结构内部的各个属性只能是整数类型。
   ```
* union 联合体
  - Union 结构的好处，主要是节省空间。它将一段内存空间，重用于不同类型的数据。定义了三个属性，但同一时间只用到一个，可节省另外两个属性的空间。Union 结构占用的内存长度，等于它内部最长属性的长度。
  ```c
    union quantity {
        short count;
        float weight;
        float volume;
    };

   // 写法一
    union quantity q;
    q.count = 4;

    // 写法二
    union quantity q = {.count=4};
  ```
* Enum 类型
  ```c
    // C 语言会自动从0开始递增，为常量赋值。但是，C 语言也允许为 ENUM 常量指定值，不过只能指定为整数，不能是其他类型
    enum colors {
        RED,
        GREEN,
        BLUE
    };
    printf("%d\n", RED); // 0
    printf("%d\n", GREEN);  // 1

    enum { ONE = 1, TWO = 2 };
    printf("%d %d", ONE, TWO);  // 1 2
  ```
* typedef
  > 用来为某个类型起别名
  ```c
    // typedef 命令可以为 struct 结构指定一个别名
    typedef struct cell_phone {
        int cell_no;
        float minutes_of_charge;
    } phone;

    phone p = { 5551234, 5 };
  ```
  + 好处
    - 更好的代码可读性，为 struct、union、enum 等命令定义的复杂数据结构创建别名，从而便于引用
    - typedef 方便以后为变量改类型。
    - 可移植性:某一个值在不同计算机上的类型，可能是不一样的。C 语言的解决办法，就是提供了类型别名，在不同计算机上会解释成不同类型，比如int32_t

## 运算符
> 运算符在底层是如何工作的
* 运算符的分类
  > 在目前 C17 标准中，C 语言一共有 48 个运算符。按照这些运算符功能的不同，我们可以将它们分为七类（分类方式并不唯一）
  - 算术运算符：+a、-a、a*b、a/b、a%b、++a、--a
  - 赋值运算符：a=b、a+=b、a-=b、a*=b、a/=b
  - 关系运算符：a==b、a!=b、a>b、a<b、 a>=b、a<=b
  - 位运算符：a&b、a|b、a^b、~a、a<<b、a>>b
  - 逻辑运算符：a&&b、a||b、!a
  - 成员访问运算符：a[b]、a.b、a->b、&a、*a
  - 其他运算符：sizeof、？：、（type）a、a(...)、a,b
* 算数、关系、位、赋值运算符
  - 这四类运算符在经过编译器处理后，一般都可以直接对应到由目标平台上相应机器指令组成的简单计算逻辑。

## 流程控制
  - 条件必须为整数表达式（0 为假，非 0 为真）。没有 JS 的 truthy/falsy 概念。
  - switch 的 case 必须为整型常量表达式（不能是字符串或变量）。
  ```c
    // do...while 结构是 while 的变体，它会先执行一次循环体，然后再判断是否满足条件。
    // 如果满足的话，就继续执行循环体，否则跳出循环。
    i = 10;
    do {
        printf("i is %d\n", i);
        i++;
    } while (i < 10);
    printf("All done!\n");

    // break 语句
    // break语句有两种用法。一种是与switch语句配套使用，用来中断某个分支的执行。
    // 另一种用法是在循环体内部跳出循环，不再进行后面的循环了。
    while ((ch = getchar()) != EOF) {
        if (ch == '\n') break;
        putchar(ch);
    }

    // continue 语句
    // 用于在循环体内部终止本轮循环，进入下一轮循环
    while ((ch = getchar()) != '\n') {
        if (ch == '\t') continue;
        putchar(ch);
    }
    // for 循环
    let num;
    for(num=0;n<9;num++){
        printf("%d\n",num);
    }
  ```

## 函数
* C 要求在调用前必须声明或定义函数
  ```c
    #include <stdio.h>

    // 函数声明（原型）
    int add(int a, int b);

    // 函数定义
    int add(int a, int b) {
        return a + b;
    }

    int main() {
        int result = add(3, 4);
        printf("%d\n", result);
        return 0;
    }
  ```
* 作用域：所有函数都在文件作用域或全局作用域
* 参数的传值引用
  - 传入的是这个变量的值的拷贝，而不是变量本身
* 函数指针
  - 函数本身就是一段内存里面的代码，C语言允许通过指针获取函数
  ```c
    void print(int a) {
      printf("%d\n", a);
    }
    void (*print_ptr)(int) = &print;
  ```
* exit
  - 该函数的原型也是定义在头文件 stdlib.h
  ```c
    // 程序运行成功 等同于 exit(0);
    exit(EXIT_SUCCESS);

    // 程序异常中止 等同于 exit(1);
    exit(EXIT_FAILURE);
  ```
* static 说明符
  - 默认情况下，每次调用函数时，函数的内部变量都会重新初始化，不会保留上一次运行的值。static 说明符表示该变量只需要初始化一次，不需要在每次调用时都进行初始化
  ```c
    #include <stdio.h>
    void counter(void) {
        static int count = 1;  // 只初始化一次
        printf("%d\n", count);
        count++;
    }
    int main(void) {
        counter();  // 1
        counter();  // 2
        counter();  // 3
        counter();  // 4
    }
  ```

## 标准库与生态
> C语言的标准库简洁而强大，是构建可移植程序的基础。它由多个头文件组成，提供了大量的函数和宏
* 常用标准库
  + <stdio.h>	输入输出：printf、scanf、fopen、fclose
     ```c
       #include <stdio.h>  
       #define _CRT_SECURE_NO_WARNINGS // scanf 要加这个

       printf("%d",result) // 单个参数整数的占位符
       printf("a=%d b=%d",123,23) // 多个参数整数的占位符 
       printf("%s",arr1) // 输出字符串
       printf("%c",ch)   // 输出字符值
       printf("%p",p)    // 输出指针的地址

      float weight;
      char str[]
      scanf("%f %s", &weight,str); // 读取键盘的输入 字符数组不用&
     ```
  + <stdlib.h>	内存分配、随机数、转换函数（atoi、malloc、free）
  + <string.h>	字符串处理（strlen、strcpy、strcmp）
  + <math.h>	数学函数（sin、sqrt），编译时常需链接 -lm
  + <time.h>	时间日期函数
  + <ctype.h>	字符分类（isdigit、isalpha）

* 常用的主流三方库
  + 基础工具库 (GLib)
    - 可以看作是 C 语言生态中的 lodash，它为 C 语言补充了大量在标准库中缺失的高级功能，是构建更复杂库和应用的基础。
    - 提供了哈希表 (GHashTable)、链表 (GList)、数组 (GArray) 等高级数据结构，以及事件循环 (GMainLoop) 和字符串处理等实用工具
    - vcpkg install glib
  + 网络通信库 (libcurl)
    - 是 C 语言世界里最流行的 HTTP 客户端库，功能对标 Node.js 中的 axios 或 node-fetch，是进行网络请求的“瑞士军刀”
    - 支持 HTTP, HTTPS, FTP 等几乎所有主流网络协议，使用简洁的 API 发送网络请求和处理响应
    - vcpkg install curl
  + 图形界面开发库 (GTK+)
    - 用 C 语言写出带窗口、按钮的桌面应用，GTK+ 是最佳选择，一个完全用 C 语言编写的、跨平台的图形用户界面库，支持 Linux, Windows 和 macOS
    - vcpkg install gtk
  + 日志记录库 (zlog / log4c)
    - 专业的日志库是调试和监控程序状态的必备工具。它们能提供日志级别、自动文件轮转、格式化输出等高级功能，比 printf 强大得多。
    - zlog: 以高性能、线程安全和分类记录著称，log4c: 灵感来自 Java 的 Log4j，通过配置文件灵活控制日志行为，使用更广泛
    - vcpkg install zlog 或 vcpkg install log4c
  + 单元测试框架 (Unity / Check)
    - Unity: 一个极轻量级的框架，由几个头文件组成，非常适合嵌入式或小型项目
    - Check: 一个功能更全面的框架，提供了丰富的断言和测试套件管理，适合大型项目。
    - vcpkg install unity 或 vcpkg install check
  + 多媒体/游戏开发库 (SDL2)
    - 提供了对音频、键盘、鼠标、游戏手柄和图形硬件（通过 OpenGL 或 Vulkan）的统一访问接口。
    - 开发游戏、模拟器、媒体播放器等需要高性能图形和声音的软件
    - vcpkg install sdl2
  + 加密与安全库 (OpenSSL)
    - 功能上类似 Node.js 的 crypto 模块，实现 SSL/TLS 协议，并提供丰富的加密、解密、哈希算法（如 RSA, AES, SHA-256）。
    - vcpkg install openssl
  + 数据压缩库 (zlib)
    - 压缩/解压文件（如 .gz 格式）、HTTP 内容压缩、游戏资源打包等
    - vcpkg install zlib
  + 嵌入式数据库 (SQLite)
    - SQLite 是一个完全独立的、无服务器的嵌入式数据库引擎，所有数据都存储在一个单一的文件中。它就像一个内置了查询引擎的 IndexedDB。
    - vcpkg install sqlite3
  + 科学计算库 (GSL)
    - GNU Scientific Library (GSL) 是一个为 C 语言设计的数值计算库，类似 JavaScript 中的 Math.js 或 simple-statistics。
    - 提供了大量数学和科学计算函数，如线性代数、微积分、随机数生成、统计、快速傅里叶变换等。
    - vcpkg install gsl
  + 嵌入式系统/物联网 (mbedTLS / LwIP)
    - 在嵌入式或物联网（IoT）这类资源受限的环境中，需要极其轻量级的库。在物联网设备、微控制器（MCU）上实现安全通信和网络连接。
    - mbedTLS: 一个为嵌入式设备优化的 TLS/SSL 库。
    - LwIP: 一个轻量级的 TCP/IP 协议栈，能在只有几十KB内存的设备上运行
    - vcpkg install mbedtls，(LwIP 可能需手动集成)
  + 其他常用库
    - fmt: 一个现代、安全的格式化库，提供了 fmt::print 函数，比 C 标准库的 printf 更安全、更易用，且性能更高。vcpkg install fmt
    - json-c / cJSON: 轻量级的 JSON 解析和生成库，用于处理 JSON 数据交换格式。vcpkg 安装：vcpkg install json-c 或 vcpkg install cjson

## 文件管理
* fopen 
  > 打开文件,函数声明在 stdio.h 中，它接受两个参数，第一个参数是文件名(可以包含路径)，第二个参数是模式字符串，指定对文件执行的操作，如r表示以读模式打开文件。返回文件指针
    - r：读模式，只用来读取数据。如果文件不存在，返回 NULL 指针。
    - w：写模式，只用来写入数据。如果文件存在，文件长度会被截为0，然后再写入；如果文件不存在，则创建该文件。
    - a：写模式，只用来在文件尾部追加数据。如果文件不存在，则创建该文件。
    - r+：读写模式。如果文件存在，指针指向文件开始处，可以在文件头部添加数据。如果文件不存在，返回 NULL 指- 针。
    - w+：读写模式。如果文件存在，文件长度会被截为0，然后再写入数据。这种模式实际上读不到数据，反而会擦掉数- 据。如果文件不存在，则创建该文件。
    - a+：读写模式。如果文件存在，指针指向文件结尾，可以在现有文件末尾添加内容。如果文件不存在，则创建该文件
    - x c11 新增了带x的写模式，两个特性：1、独占性，其他程序无法访问 2、fopen 失败也不丢失内容
* fclose
  - 关闭fp指定的文件，必要时刷新缓冲区，成功关闭返回0, 否则返回EOF
* getc|putc
  + 与getchar、putchar类似
    - ch=getchar 从标准输入中获取一个字符，ch=getc(fp) 从fp指定的文件中获取一个字符
    - putc(ch,fpout) 把字符 ch 放入 FILE 指针 fpout 指定的文件中
* 文件指针
  - C 语言提供了一个 FILE 数据结构，记录了操作一个文件所需要的信息，该结构定义在头文件stdio.h
  - 开始操作一个文件之前，就要定义一个指向该文件的 FILE 指针，相当于获取一块内存区域，用来保存文件信息。
  ```c
    // 案例1：读取文件完整的示例
    #include <stdio.h>
    int main(void) {
    
        FILE* fp;
        char c;
        // 第一步，使用fopen()打开指定文件，返回一个 File 指针。如果出错，返回 NULL
        fp = fopen("hello.txt", "r");
        if (fp == NULL) {
            return -1;
        }
        // 第二步，使用读写函数，从文件读取数据，或者向文件写入数据。fgetc()函数，从已经打开的文件里面，读取一个字符。
        c = fgetc(fp);
        printf("%c\n", c);

        // 第三步，fclose()关闭文件，同时清空缓存区。
        fclose(fp);

        return 0;
    }

    // 案例2：读取文件字符，一直读完为止
    // EOF:getc 读到最后一个字符返回的特殊值
    int ch;
    FILE* fp;
    fp = fopen("hello.txt", "r");
    while((ch=getc(fp))!=EOF){
        putchar(ch);
    }
  ```
* 标准流
  + Linux 系统默认提供三个已经打开的文件，它们的文件指针如下。
    - stdin（标准输入）：默认来源为键盘，文件指针编号为0。
    - stdout（标准输出）：默认目的地为显示器，文件指针编号为1。
    - stderr（标准错误）：默认目的地为显示器，文件指针编号为2。
* fprintf|fscanf|fgets|fputs
  - 用于向文件写入格式化字符串，用法与 printf 类似
  ```c
    // fprintf()可以替代printf()。
    printf("Hello, world!\n");
    fprintf(stdout, "Hello, world!\n");
  ```
* fseek|ftell
  - fseek 函数可把文件看做数组，在fopen打开的额文件中直接移动到任意字节处
* fwrite
  - 用来一次性写入较大的数据块，主要用途是将数组数据一次性写入文件，适合写入二进制数据
  ```c
    #include <stdio.h>
    int main(void) {
        FILE* fp;
        unsigned char bytes[] = {5, 37, 0, 88, 255, 12};

        fp = fopen("output.bin", "wb");
        fwrite(bytes, sizeof(char), sizeof(bytes), fp);
        fclose(fp);
        return 0;
    }

  ```


## 内存管理
> C 语言的内存管理，分成两部分。一部分是系统管理的，另一部分是用户手动管理的。
* 手动分配与释放
  - 栈内存：系统管理的，如局部变量、函数参数，函数返回时自动释放。
  - 堆内存：手动管理的，如全局变量，用 malloc / calloc 申请，用 free 释放。忘记会导致内存泄漏
    ```c
        // malloc 向系统要求一段内存，系统就在“堆”里面分配一段连续的内存块给它
        // calloc 作用与malloc 相似，也是分配内存块
        #include <stdlib.h> // malloc、calloc原型定义在头文件 stdlib.h

        int *arr = malloc(10 * sizeof(int));  // 申请 10 个 int 的空间
        if (arr == NULL) {
            // 内存分配失败处理，这时返回常量NULL
        }
        // 使用 arr...
        free(arr);   // 必须释放，否则内存泄漏
        arr = NULL;  // 避免悬挂指针

        // calloc 与 malloc的区别:
        // calloc() 接受两个参数，第一个参数是数据类型的值的数量，第二个是该数据类型的单位字节长度。
        int* p = calloc(10, sizeof(int));
        // 等同于
        int* p = malloc(sizeof(int) * 10);

        memset(p, 0, sizeof(int) * 10);
    ```
* void 指针
  > void 指针等同于无类型指针，可以指向任意类型的数据，但是不能解读数据
  ```c
    int x = 10;
    void* p = &x; // 整数指针转为 void 指针
    int* q = p;   // void 指针转为整数指针

    // 由于不知道 void 指针指向什么类型的值，所以不能用*运算符取出它指向的值。
    char a = 'X';
    void* p = &a;

    printf("%c\n", *p); // 报错

  ```
* memcpy|memmove|memcmp
  - memcpy 用于将一块内存拷贝到另一块内存。该函数的原型定义在头文件 string.h。
  - memmove 函数用于将一段内存数据复制到另一段内存
  - memcmp 函数用来比较两个内存区域
  ```c
  #include <stdio.h>
  #include <string.h>

  int main(void) {
    char source[] = "Goats!";
    char dest[100];

    memcpy(dest, source, sizeof(s));  // 拷贝7个字节，包括终止符
    printf("%s\n", t);  // "Goats!"
    return 0;
  }


  char* s = "hello world";
  size_t len = strlen(s) + 1;
  char *c = malloc(len);

  if (c) {
    // strcpy() 的写法
    strcpy(c, s);

    // memcpy() 的写法
    memcpy(c, s, len);
  }
  // memcpy 可以取代 strcpy 进行字符串拷贝，而且是更好的方法，不仅更安全，速度也更快，它不检查字符串尾部的\0字符。
  ```

## 位操作
  ```c
    // 取反运算符～
    // 用来将每一个二进制位变成相反值，即0变成1，1变成0。
    // 返回 01101100
    ~ 10010011

    // 与运算符 & 
    // 将两个值的每一个二进制位进行比较，返回一个新的值。当两个二进制位都为1，就返回1，否则返回0。
    // 返回 00010001
    10010011 & 00111101

    int val = 3;
    val = val & 0377;
    // 简写成
    val &= 0377;

    // 或运算符|
    // 将两个值的每一个二进制位进行比较，返回一个新的值。两个二进制位只要有一个为1（包含两个都为1的情况），就返回1，否则返回0。
    // 返回 10111111
    10010011 | 00111101

    int val = 3;
    val = val | 0377;
    // 简写为
    val |= 0377;

    // 异或运算符^
    // 将两个值的每一个二进制位进行比较，返回一个新的值。两个二进制位有且仅有一个为1，就返回1，否则返回0。
    // 返回 10101110
    10010011 ^ 00111101

    int val = 3;
    val = val ^ 0377;

    // 简写为
    val ^= 0377;

    // 左移运算符<<
    // 将左侧运算数的每一位，向左移动指定的位数，尾部空出来的位置使用0填充。
    // 1000101000
    10001010 << 2

    int val = 1;
    val = val << 2;

    // 简写为
    val <<= 2;

    // 右移运算符>>
    // 将左侧运算数的每一位，向右移动指定的位数，尾部无法容纳的值将丢弃，头部空出来的位置使用0填充。
    // 返回 00100010
    10001010 >> 2
  ```

## 预处理：编译前的文本替换
> C 源码在编译前会经过预处理器，以 # 开头的指令处理。
* 预处理指令
  + #include 包含头文件（类似 JS 的 import，但它是文本复制）。
    ```c
      // 形式一
      #include <foo.h> // 加载系统提供的文件，<> 表示导入系统文件
      // 形式二
      #include "foo.h" // 加载用户提供的文件，”“ 自定义文件
      // 形式三
      #include <stdio.h> // 加载编译器提供的标准库， std 是一个标准库
    ```
  + #define 宏定义（文本替换，不是函数，无类型检查）。
    ```c
      #define MAX 100
      // 过长用反斜杠
      #define OW "C programming language is invented \
      in 1970s."

      // 带参数的宏
      #define SQUARE(X) X*X

      // 由于宏不涉及数据类型，所以替换以后可能为各种类型的值。
      // 如果希望替换后的值为字符串，可以在替换文本的参数前面加上#
      #define STR(x) #x
      // 等同于 printf("%s\n", "3.14159");
      printf("%s\n", STR(3.14159));

      // ##运算符。它起到粘合作用，将参数“嵌入”一个标识符之中。
      #define MK_ID(n) i##n
      int MK_ID(1), MK_ID(2), MK_ID(3);
      // 替换成
      int i1, i2, i3;
    ```
  + #undef
    - 用来取消已经使用 #define 定义的宏
    ```C
      #define LIMIT 400
      #undef LIMIT
    ```
  + 条件编译：#ifdef、#ifndef、#endif 用于不同平台或调试版本。
    ```c
      // 满足条件时，内部的行会被编译，否则就被编译器忽略。
      #define FOO 1
      #if FOO
        printf("defined\n");
      #else
        printf("not defined\n");
      #endif

      // #if的常见应用就是打开（或关闭）调试模式。
      #define DEBUG 1
      #if DEBUG
          printf("value of i : %d\n", i);
          printf("value of j : %d\n", j);
      #endif

      #ifdef MAVIS
          #include "foo.h"
          #define STABLES 1
      #else
          #include "bar.h"
          #define STABLES 2
      #endif

      #pragma c9x on // 使用 C99 标准
    ```
* 预定义宏
  > C 语言提供一些预定义的宏，可以直接使用
  - __DATE__：编译日期，格式为“Mmm dd yyyy”的字符串（比如 Nov 23 2021）
  - __TIME__：编译时间，格式为“hh:mm:ss”
  - __FILE__：当前文件名
  - __LINE__：当前行号
  - __func__：当前正在执行的函数名。该预定义宏必须在函数作用域使用
  - __STDC__：如果被设为1，表示当前编译器遵循 C 标准
  - __STDC_HOSTED__：如果被设为1，表示当前编译器可以提供完整的标准库；否则被设为0（嵌入式系统的标准库常常是不完整的）
  - __STDC_VERSION__：编译所使用的 C 语言版本，是一个格式为yyyymmL的长整数，C99 版本为“199901L”，C11 版本为“201112L”，C17版本为“201710L”
  ```c
    #include <stdio.h>
    int main(void) {
        printf("This function: %s\n", __func__);
        printf("This file: %s\n", __FILE__);
        printf("This line: %d\n", __LINE__);
        printf("Compiled on: %s %s\n", __DATE__, __TIME__);
        printf("C Version: %ld\n", __STDC_VERSION__);
    }
    /* 输出如下
    This function: main
    This file: test.c
    This line: 7
    Compiled on: Mar 29 2021 19:19:37
    C Version: 201710
    */
  ```

## 错误处理：没有异常机制
  - C 中通常通过：函数返回值（如返回 NULL 指针、-1 表示失败）。
  - 全局变量 errno（需要包含 <errno.h>）。
  - 自己定义错误码。
  ```c
   // 如打开文件失败：
    FILE *f = fopen("data.txt", "r");
    if (f == NULL) {
        perror("Failed to open file");  // 打印错误原因
        return 1;
    }
  ```

## 命令行环境
  > C 语言提供了 getenv()函数（原型在stdlib.h）用来读取命令行环境变量。
  ```c
    #include <stdio.h>
    #include <stdlib.h>
    int main(void) {
        char* val = getenv("HOME");

        if (val == NULL) {
            printf("Cannot find the HOME environment variable\n");
            return 1;
        }
        printf("Value: %s\n", val);
        return 0;
    }
  ```
