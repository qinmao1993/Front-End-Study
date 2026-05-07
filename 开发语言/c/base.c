// c 核心的语法
// 这个程序演示了C语言的核心语法，包括宏定义、枚举、结构体、联合体、泛型宏等。
// 主要功能是定义一个连接结构体CONN，并演示如何使用它来存储和打印网络连接信息。

#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>
#include <assert.h>
#include <stdbool.h>

// 定义用到的宏常量与宏函数
#define BOOL_TRUE 1  // 定义布尔真值
#define BOOL_FALSE 0 // 定义布尔假值

// 泛型宏，用于获取变量的类型名称
#define typename(x) _Generic((x),         \
    unsigned short: "unsigned short int", \
    unsigned long: "unsigned long int",   \
    default: "unknown")

// 定义枚举类型 IP_ADDR_TYPE，用于表示地址类型
typedef enum
{
    Host, // 主机名类型
    IP    // IP地址类型
} IP_ADDR_TYPE;

// 定义结构 CONN，用于表示网络连接
typedef struct
{
    size_t id;           // 连接ID
    uint16_t port;       // 端口号
    bool closed;         // 是否关闭
    IP_ADDR_TYPE addr_type; // 地址类型
    union
    {
        char host_name[256]; // 主机名
        char ip[24];         // IP地址
    }; // 地址联合体，根据addr_type决定使用哪个成员
} CONN;

// 定义函数 findAddr，用于根据地址类型返回相应的地址字符串
// 参数: pip - 指向CONN结构的指针
// 返回: 地址字符串
inline static const char *findAddr(const CONN *pip)
{
    return pip->addr_type == Host ? pip->host_name : pip->ip;
}

int main(void)
{    
    // 编译时断言，确保CONN结构体大小不超过限制
    static_assert(sizeof(CONN) <= 0x400, "the size of CONN object exceeds limit.");
    
    // 构造一个数组，包含三个 CONN 对象，演示不同的连接配置
    const CONN conns[] = {
        [0] = {2, 8080, BOOL_FALSE, IP, {.ip = "192.168.1.1"}},      // IP地址连接
        [2] = {1, 80, BOOL_TRUE, IP, {.ip = "127.0.0.1"}},           // 本地IP连接，已关闭
        {3, 8088, BOOL_FALSE, Host, {.host_name = "http://localhost/"}}}; // 主机名连接

    // 遍历连接数组，打印每个连接的信息
    for (size_t i = 0; i < (sizeof(conns) / sizeof(CONN)); ++i)
    {
        printf(
            "Port: %d\n"
            "Host/Addr: %s\n"
            "Internal type of `id` is: %s\n\n",
            conns[i].port,
            findAddr(&conns[i]),
            typename(conns[i].id));
    }
    // 返回成功退出码
    return EXIT_SUCCESS;
}