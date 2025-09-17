// c 核心的语法
#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>
#include <assert.h>
#include <stdbool.h>

// 定义用到的宏常量与宏函数
#define BOOL_TRUE 1
#define BOOL_FALSE 0

#define typename(x) _Generic((x),         \
    unsigned short: "unsigned short int", \
    unsigned long: "unsigned long int",   \
    default: "unknown")

// 定义枚举类型 IP_ADDR_TYPE
typedef enum
{
    Host,
    IP
} IP_ADDR_TYPE;

//  定义结构 CONN;
typedef struct
{
    size_t id;
    uint16_t port;
    bool closed;
    IP_ADDR_TYPE addr_type;
    union
    {
        char host_name[256];
        char ip[24];
    };
} CONN;

// 定义函数 findAddr，用于打印 assert(pip != NULL);
inline static const char *findAddr(const CONN *pip)
{
    return pip->addr_type == Host ? pip->host_name : pip->ip;
}

int main(int argc, char *argv[])
{
    // 运行时断言，判断传入的 CONN 指针是否有效;
    static_assert(sizeof(CONN) <= 0x400, "the size of CONN object exceeds limit.");
    
    // 构造一个数组，包含三个 CONN 对象;
    const CONN conns[] = {
        [0] = {2, 8080, BOOL_FALSE, IP, {.ip = "192.168.1.1"}},
        [2] = {1, 80, BOOL_TRUE, IP, {.ip = "127.0.0.1"}},
        {3, 8088, BOOL_FALSE, Host, {.host_name = "http://localhost/"}}};

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
    // 标准库中的宏常量 EXIT_SUCCESS,实际值就是数字 0
    return EXIT_SUCCESS;
}