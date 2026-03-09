# gcc 升级

## 安装步骤
* 方式一：安装指定版本的gcc工具链
  ```bash
    # centos7
    yumdownloader --resolve --destdir=/home/rpm gcc      

    # 安装 GCC 8 编译器和 C++ 编译器及其相关工具。
    yum install -y devtoolset-8-gcc devtoolset-8-gcc-c++

    # 安装完成后，为了使用 devtoolset-8 中的 GCC，你需要在每次打开新的 shell 时启用它。可以通过以下命令启用：
    scl enable devtoolset-8 bash

    # 需要在启用 Developer Toolset 后的每个 shell 中自动启用，可以将相关命令添加到你的 ~/.bashrc 或 ~/.bash_profile 文件中 或者 ls 软连接

    mv /usr/bin/gcc /usr/bin/gcc-4.8.5
    ln -s /opt/rh/devtoolset-8/root/bin/gcc /usr/bin/gcc

    mv /usr/bin/g++ /usr/bin/g++-4.8.5
    ln -s /opt/rh/devtoolset-8/root/bin/g++ /usr/bin/g++

  ```

