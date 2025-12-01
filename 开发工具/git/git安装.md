# git 安装

## git 源码安装
* 依赖库
  - autotools
  - curl
  - zlib
  - openssl
  - expat 
  - libiconv
  
  ```bash
    dnf install dh-autoreconf curl-devel expat-devel gettext-devel \
    openssl-devel perl-devel zlib-devel
  ```
* 编译安装
  ```bash
    # 下载最新源码
    git clone git://git.kernel.org/pub/scm/git/git.git

    tar -zxvf git-2.8.0.tar.gz
    cd git-2.8.0
    ./configure --prefix=/usr/local/git-2.8.0
    make -j2
    make install

    # 用软连接的形式
    ln -s /usr/local/git-2.8.0/bin/git /usr/bin/git
  ```