# glibc 升级

## 背景
* 在离线环境下，有些软件包依赖高版本的glbc,如
  - centos7 安装nodejs18+
  - insightface 需要glibc 2.28及以上

## 查看版本
  ```bash
    ldd --version
    # 查看 GLIBC 文件位置
    whereis libc.so
    # 输出中将会显示具体的 GLIBC 版本号。
    ls -l /lib64/libc.so.*

    # 查看系统内安装的glibc版本
    strings /lib64/libc.so.6 | grep -E "^GLIBC" | sort -V -r | uniq

  ```

## 必须得依赖
  - yum install gcc gawk bison texinfo

## 依赖升级
* centos7 升级GCC(默认为4 升级为8)
* centos7 升级 make(默认为3.82 升级为4.3) 4.4版本网上反映编译 glibc 报错

## 离线安装依赖
  ```bash
    # 离线下载
    yumdownloader --resolve --destdir=/home/rpm devtoolset-8-gcc devtoolset-8-gcc-c++
    
    # 缺少bison、texinfo就安装
    yumdownloader --resolve --destdir=/home/rpm bison texinfo

  ```

* 升级步骤
  - [gcc升级](../linux/gcc源码安装.md)
  - [make升级](../linux/make源码安装.md)

## 源码安装
```bash
    # 将 源码 放在 /usr/local/src/glibc-2.28
    cd /usr/local/src/glibc-2.28
    mkdir build
    cd /usr/local/src/glibc-2.28/build

    # --disable-profile 禁用性能分析支持，可以加快编译和安装过程。
    # --enable-add-ons 启用额外的插件或者附加组件的支持
    # --with-headers 这个选项指定了系统头文件的路径
    # --with-binutils=/usr/bin 这个选项指定了 binutils 工具集的路径。binutils 是一组用于编译、链接和汇编的工具

    # --prefix=/usr 装到系统根目录下（覆盖安装）

    # --enable-obsolete-nsl 解决 undefined reference to '_nsl_default_nss@GLIBC_PRIVATE'

    ../configure --prefix=/usr --disable-profile --enable-obsolete-nsl --enable-add-ons --with-headers=/usr/include --with-binutils=/usr/bin

    make -j5

    # make install 报错： /usr/bin/ld: cannot find -lnss_test2.
    # 将nss_test2 检查 skip掉，重新 make install.
    sed -i '128i\ && $ name ne "nss_test2"' ../scripts/test-installation.pl 

    make install

    # 检查版本
    ldd --version 
```

## 升级后中文乱码问题
  - [参考](https://blog.csdn.net/guitar___/article/details/77651983)
  ```bash
    # 如何安装在自定义目录如 /usr/local/glibc-2.28
    # 将/usr/lib/locale这个locale命令使用的 locale-archive 文件copy到 /usr/local/glibc-2.28/bin/locale/locale-archive即可
    cp /usr/lib/locale/locale-archive /usr/local/glibc-2.28/lib/locale/
  ```

## 安装失败
* make distclean 删除后重新编译安装
  - 删除编译生成的目标文件：
  - 清除生成的可执行文件：
  - 清理其他生成的辅助文件：
