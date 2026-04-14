# opencv 安装

## 方式一：预构建版本（包管理安装:python）
  ```bash
    # 安装开发版(支持中文标记)
    pip install opencv-python-rolling 
    # 安装lts版
    pip|conda install opencv-python

    # 可选 人脸模型的拓展包
    pip install opencv-contrib-python-rolling
  ```

## 方式二：源码安装
> OpenCV 使用 CMake 构建管理系统进行配置和构建
* 先决条件：必需的依赖库
  - 需要用 CMake 3.9 或更高版本 
    ```bash
      cmake --version
      # mac
      brew install cmake 
    ``` 
  - C++ 编译器：通常是 GCC/G++ 或 Clang 编译器
  - Python 2.7 或更高版本以及 Numpy 1.5 或更高版本

* 获取软件源
  + OpenCV 有两个代码仓库：
    - opencv - 具有稳定且积极支持的算法的主仓库
    - 包含实验性和非自由（专利）算法的opencv_contrib
    - 以及一个包含测试数据的存储库：opencv_extra
  + 下载指定版本
    - https://github.com/opencv/opencv/releases 
    - https://github.com/opencv/opencv_contrib/releases
    - https://github.com/opencv/opencv_extra/releases
  + 克隆存储库
    ```bash
      # 下载多个版本注意版本对应
      git clone https://github.com/opencv/opencv.git

      # 可选
      git clone https://github.com/opencv/opencv_contrib
      git clone https://github.com/opencv/opencv_extra
    ```


* 配置
  - 在此步骤中，CMake 将验证所有必要的工具和依赖项是否可用并与库兼容，并将为所选构建系统生成中间文件。
  - 它可以是 Makefile、IDE 项目和解决方案等。通常此步骤在新创建的 build 目录中执行：
  ```bash
    cmake -G<generator> <configuration-options> <source-directory>
  ```
  - 也可以使用 cmake-gui 应用程序允许使用图形用户界面查看和修改可用选项

* 构建安装
  - 在构建过程中，源文件被编译为目标文件,这些目标文件链接在一起或以其他方式组合到库和应用程序中
  ```bash
    # 构建
    cmake --build <build-directory> <build-options>

    cmake --build <build-directory> --target install <other-options>

    # 如果安装根位置是受保护的系统目录，则必须使用超级用户或管理员权限（例如 ）运行安装过程。sudo cmake ...

  ```

* macOS安装
  ```bash
    # 1. 创建一个临时目录,在其中放置生成的 Makefile、项目文件以及目标文件和输出二进制文件
    mkdir build
    cd build 
   
    # 2. 配置。
    # cmake [<some optional parameters>] <path to the OpenCV source directory>
    cmake -DCMAKE_BUILD_TYPE=发布 -DBUILD_EXAMPLES=ON ../opencv 

    # 3. 参数 
    # build type: (or CMAKE_BUILD_TYPE=Release Debug)
    # 可选：使用opencv_contrib 设置为 OPENCV_EXTRA_MODULES_PATH <path to opencv_contrib>/modules
    # 可选：构建文档 BUILD_DOCS=ON

    # 可选： python 
    PYTHON3_EXECUTABLE = <path to python>
    PYTHON3_INCLUDE_DIR = /usr/include/python<version>
    PYTHON3_NUMPY_INCLUDE_DIRS = /usr/lib/python<version>/dist-packages/numpy/core/include/

    # 4. 编译
    make -j7 # 并行运行 7 个作业

    # 5. 安装
    make install

    # 验证
    # 安装完成后，所有文件都在“/usr/local/”目录。打开终端，并导入 cv2。
    import cv2 as cv
    print(cv.__version__)

  ```

* linux(ubuntu/centos8+)
  - TODO
  
  ```bash
    # ubuntu 
    apt-get install cmake
    apt-get install python-devel numpy
    apt-get install gcc gcc-c++

    # 需要 GTK 库支持 GUI 功能
    apt-get install gtk2-devel

    # 需要 v4l 库支持相机功能
    # 需要 ffmpeg 库和 gstreamer 库支持媒体功能
    apt-get install ffmpeg-devel

    # 支持媒体功能
    apt-get install gstreamer-plugins-base-devel
  ```

