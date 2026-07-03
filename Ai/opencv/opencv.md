# opencv
开源计算机视觉库。它最初由英特尔公司于1999年发起，2000年正式开源，旨在为计算机视觉应用提供一个通用的基础架构。核心代码用C++编写，开源与跨平台，多语言支持，功能极其丰富

## 核心特性
* 跨平台：一套代码可运行在桌面、服务器、移动设备和嵌入式平台（如树莓派、Jetson）。
* 多语言支持：核心用 C++ 编写，提供完善的 Python、Java、JavaScript（OpenCV.js）、MATLAB 等接口，同时支持 C#（Emgu CV）等第三方封装。
* 高度优化：充分利用多核 CPU（SSE、AVX 指令集等），部分算法有 GPU 加速实现（CUDA、OpenCL），Intel 的 IPP（Integrated Performance Primitives）在编译时可透明集成进一步提升速度。
* 商业化友好：采用宽松的 Apache 2 许可证，可免费用于商业和学术项目，无需公开源码。
* 庞大的算法集合：覆盖从基础图像处理到深度学习推理的 2500 多种算法。

## 版本
* OpenCV 目前最新的稳定版本是 OpenCV 5.0.0，它在2026年6月发布，是一次从里到外的大规模革新
* OpenCV 5主要更新亮点
  - 全新DNN引擎：采用基于图的先进架构，对 ONNX 模型的支持率从约23%提升至80%以上。推理速度显著提升，例如YOLOv8的推理速度比PyTorch快2.3倍。
  - 原生支持大模型：原生支持 Transformer、大语言模型(LLM)、视觉语言模型(VLM) 等，降低端侧AI部署门槛。
  - 更好的Python集成：支持更现代化的Python和语言绑定，并引入了命名参数，告别猜测参数顺序的烦恼。
  - 更快更小的核心：代码更精简，并移除了传统的C API，使得库体积减小、运行效率更高。
  - 简化的硬件加速：硬件供应商可以直接插入优化后的内核，让开发者能更轻松地利用硬件加速能力。
  - 新的数据类型：规范了0D/1D张量，并原生支持 FP16 和 BF16 低精度数据类型，以降低内存占用。
  + 其他重要更新	
    - 扩展了3D视觉功能（如多相机标定）
    - 改进了文档，更现代化且易于导航
    - pip版本已于6月8日提供
* OpenCV 4.13.0：最后的 4.x 大版本

## 架构与主要模块
* core
  - 核心数据结构（如 Mat、Vec、Scalar）、基础运算、内存管理、并行框架、数学工具等。
* imgproc
  - 图像处理：滤波（高斯、中值、双边）、几何变换（仿射、透视）、颜色空间转换、直方图、形态学操作、轮廓查找、霍夫变换等。
* highgui
  - 图像/视频的文件读写、窗口创建、鼠标键盘交互、Trackbar 控件（简单 GUI）。
* video
  - 运动分析和目标跟踪：背景减除（MOG2、KNN）、光流（稀疏、稠密）、Kalman 滤波、CamShift 等。
* calib3d
  - 相机标定、立体视觉、三维重建基础：单/双目标定、极线几何、位姿估计（PnP）、立体匹配等。
* features2d
  - 二维特征检测与描述：SIFT*、SURF*、ORB、AKAZE、BRISK，特征匹配与单应性估计。（带 * 的专利算法在 opencv_contrib 中）
* objdetect
  - 目标检测：级联分类器（Haar/LBP）、HOG 行人检测、QR 码检测、Aruco 标记检测等。
* dnn
  - 深度神经网络推理：支持导入 Caffe、TensorFlow、ONNX、Torch、Darknet 等框架的预训练模型，支持 CPU、OpenCL、Vulkan、CUDA 后端。无需额外深度学习框架。
* ml
  - 传统机器学习：支持向量机(SVM)、K近邻、决策树/随机森林、Boosting、神经网络（浅层）等。
* photo
  - 计算摄影：图像去噪、HDR 合成、图像修复（inpainting）、风格迁移、白平衡等。
* stitching
  - 全景图像拼接流水线。
* shape
  - 形状匹配与形状距离计算。
* contrib	
  - 社区贡献库：人脸识别（FaceRecognizer）、文本检测（ERText）、生物启发模型、结构光、SLAM 接口等大量前沿/实验性算法。

## 核心数据结构：cv::Mat
> Mat 是最核心的类，封装了图像/矩阵数据并自动管理内存。主要
* 特点
  - 引用计数：拷贝 Mat 对象只增加引用计数而不是复制数据，类似智能指针。只有当真正需要深拷贝时才调用 clone() 或 copyTo()。
  - 多维数据：可表示 1D 数组、2D 灰度/彩色图像、3D 体素等，维度可达 32。
  - 像素类型：支持常见类型（CV_8U、CV_32F、CV_64F 等）和多通道（1~512）。
  - 便捷操作：支持 ROI（image(rect)）、通道分离/合并、逐元素运算、与其他库（如 NumPy）无缝转换。
* 主要属性
  - rows 矩阵的行数（图像高度）
  - cols 矩阵的列数（图像宽度）
  - dims 矩阵的维度，例如二维矩阵为2，三维则为3
  - channels() 矩阵每个元素的通道数。如彩色图像为3（BGR），灰度图为1
  - depth() 每个通道的数值类型，常用值：0(CV_8U), 1(CV_8S), 2(CV_16U), 3(CV_16S), 4(CV_32S), 5(CV_32F), 6(CV_64F)。
  - type()  结合了 depth 和 channels 的综合类型，如 CV_8UC3
  - total() 每个元素的总字节数（elemSize1() * channels）
  - elemSize1 每个通道的字节数
* 创建Mat
  + js
    ```js
        // --- 基础构造函数 ---
        // 1. 默认构造
        let mat = new cv.Mat();
        // 2. 通过尺寸 (Size) 和类型构造
        // cv.Mat(size, type);
        let mat = new cv.Mat(size, cv.CV_8UC3);
        // 3. 通过行、列和类型构造
        // cv.Mat(rows, cols, type);
        let mat = new cv.Mat(2, 2, cv.CV_32F);
        // 4. 带初始值的构造 (所有像素设为标量值)
        let mat = new cv.Mat(rows, cols, type, new cv.Scalar());

        // --- 静态工厂方法 ---
        // 5. 创建全零矩阵
        let zeros_mat = cv.Mat.zeros(3, 3, cv.CV_8UC1);

        // 6. 创建全一矩阵
        let ones_mat = cv.Mat.ones(3, 3, cv.CV_32F);

        // 7. 创建单位矩阵 (对角线为1)
        let eye_mat = cv.Mat.eye(3, 3, cv.CV_64F);

        // --- 从现有数据创建 ---
        // 8. 从JS数组创建
        let js_array = [1, 2, 3, 4];
        let mat_from_array = cv.matFromArray(2, 2, cv.CV_8UC1, js_array);

        // 9. 从 HTML 元素读取图像,此方法同样适用于 HTMLCanvasElement
        let imgElement = document.getElementById('myImage');
        let mat_from_img = cv.imread(imgElement);

        // 10. 从 ImageData 对象创建
        let ctx = canvas.getContext('2d');
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let mat_from_imgData = cv.matFromImageData(imgData);

        // js 特别注意 delete() 手动释放内存
    ```
  + python
    - Python 中不直接操作 Mat 类，而是与 NumPy ndarray 高度整合，绝大多数操作通过 NumPy 进行。
    ```py
        import cv2
        import numpy as np

        # 1. 创建空白/全零图像 (灰度图: 单通道, 类型 uint8)
        # 参数: (高, 宽, 通道数), 数据类型
        blank_grayscale = np.zeros((300, 300), dtype=np.uint8)

        # 2. 创建空白/全零彩色图像 (BGR: 3通道)
        blank_color = np.zeros((300, 300, 3), dtype=np.uint8)

        # 3. 创建指定数据的矩阵 (2x2, 单通道)
        data_list = [[1, 2], [3, 4]]
        mat_from_list = np.array(data_list, dtype=np.float32)

        # 4. 创建特定值填充的图像 (全白或全灰)
        white_image = np.full((300, 300, 3), 255, dtype=np.uint8)
        gray_image = np.full((300, 300), 128, dtype=np.uint8)

        # 5. 从现有图像数据创建 (通常通过 imread)
        # img = cv2.imread('path_to_image.jpg')

        # 6. 创建单位矩阵 (对角线为1)
        identity_matrix = np.eye(3, dtype=np.float64)
    ```
  + c++
   ```cpp
    #include <opencv2/opencv.hpp>
    using namespace cv;

    // 1. 默认构造
    Mat m1; 

    // 2. 指定尺寸（行、列）和类型 （2行3列的浮点数矩阵）
    Mat m2(2, 3, CV_32F); 

    // 3. 使用 Size 结构指定尺寸（Size(宽, 高)）
    Mat m3(Size(3, 2), CV_8UC3); // 3列2行的彩色图像

    // 4. 带初始值的构造函数（创建3x3的3通道矩阵，所有像素为 (0,0,255) - 红色）
    Mat m4(3, 3, CV_8UC3, Scalar(0, 0, 255));

    // 5. 使用 create 函数（不改变现有矩阵内容，仅当新尺寸/类型不同时才重新分配内存）
    Mat m5;
    m5.create(4, 4, CV_8UC1);

    // 6. MATLAB风格初始化（全零、全一、单位矩阵）
    Mat m6 = Mat::zeros(3, 3, CV_8UC1);
    Mat m7 = Mat::ones(2, 3, CV_32F);
    Mat m8 = Mat::eye(3, 3, CV_64F);

    // 7. 从数组中创建
    float data[4] = {1.0f, 2.0f, 3.0f, 4.0f};
    Mat m9(2, 2, CV_32F, data); 
    // 注意：此方式未复制数据，直接使用 data 的内存，修改 m9 将修改 data 原始数据

    // 8. 使用 << 运算符初始化
    Mat m10 = (Mat_<int>(3,3) << 1, 2, 3, 4, 5, 6, 7, 8, 9);

    // 9. 从现有图像读取（常用于实际开发）
    // Mat img = imread("path/to/image.jpg");

    // 10. 克隆与复制（实现数据深拷贝）
    Mat m11 = m4.clone();
    Mat m12;
    m4.copyTo(m12);
   ```
* 拷贝Mat
  ```js
    // 1. Clone
    let dst = src.clone();
    // 2. CopyTo(only entries indicated in the mask are copied)
    src.copyTo(dst, mask);
  ```
  ```py
    # Python 示例
    import cv2
    frames = []
    cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        # frames.append(frame)         # 错误：浅拷贝，所有帧相同
        frames.append(frame.copy())    # 正确：深拷贝，每帧独立
  ```
  ```c++
    // C++ 示例
    vector<Mat> frames;
    Mat frame;
    while (videoCapture.read(frame)) {
        // frames.push_back(frame);   // 错误：浅拷贝，所有帧相同
        frames.push_back(frame.clone()); // 正确：深拷贝，每帧独立
    }
  ```

## 应用领域
* 安防与监控：运动检测、人脸识别、车牌识别、异常行为分析。
* 自动驾驶与机器人：车道线检测、物体检测与跟踪、即时定位与地图构建（SLAM）、深度估计。
* 医疗影像：细胞计数、肿瘤识别、图像配准与分割。
* 增强现实（AR）：相机标定、姿态估计、平面检测、增强信息叠加。
* 工业视觉：缺陷检测、尺寸测量、二维码/条形码读取、机器人抓取定位。
* 图像与视频编辑：美颜特效、背景替换、全景拼接、图像修复。
* AI 推理部署：通过 dnn 模块在边缘设备上运行分类、检测、分割、风格迁移等深度学习模型


## 图像 ROI(Region of Interest，感兴趣区域)
> 是图像处理中的核心概念，指从原始图像中选取的一个矩形（或其他形状）子区域，后续所有处理（如检测、分割、滤波）都只在这个区域内进行。
* 使用 ROI 的主要好处是
  - 提升性能：减少需要处理的数据量，加速算法。
  - 聚焦关键信息：忽略背景干扰，提高鲁棒性。
  - 实现局部操作：例如只在车牌区域做字符识别，或在人脸上叠加贴纸。
* 示例
  ```c++
    cv::Mat image = cv::imread("image.jpg");
    // 定义 ROI 区域：矩形左上角 (x, y) = (100, 50)，宽度 200，高度 150
    cv::Rect roi_rect(100, 50, 200, 150);
    cv::Mat roi = image(roi_rect);   // 浅拷贝，共享数据

    // 也可以使用行、列范围
    cv::Mat roi2 = image(cv::Range(50, 200), cv::Range(100, 300)); // (行范围, 列范围)

    // 在 ROI 上操作会直接影响原图
    cv::rectangle(roi, cv::Point(0, 0), cv::Point(roi.cols-1, roi.rows-1), cv::Scalar(0,0,255), 2);

    // 如需独立副本进行修改而不影响原图，使用 clone()
    cv::Mat roi_copy = image(roi_rect).clone();
  ```
  ```js
    let src = cv.imread('imageElement');
    let rect = new cv.Rect(100, 50, 200, 150);
    let roi = src.roi(rect);   // 浅拷贝
    // 或通过行、列范围
    // let roi = src.rowRange(50, 200).colRange(100, 300);

    // 在 ROI 上画矩形框（影响原图）
    let color = new cv.Scalar(0, 0, 255);
    cv.rectangle(roi, new cv.Point(0, 0), new cv.Point(roi.cols-1, roi.rows-1), color, 2);

    // 记得释放内存
    src.delete(); 
    roi.delete();
  ```
  ```py
    import cv2
    imgMat = cv2.imread('image.jpg')

    # 定义 ROI：y方向起始50，结束200；x方向起始100，结束300
    roi = imgMat[50:200, 100:300]   # numpy 切片，同样是视图（浅拷贝）

    # 在原图上绘制 ROI 边框（修改 ROI 就是修改原图）
    cv2.rectangle(roi, (0, 0), (roi.shape[1]-1, roi.shape[0]-1), (0,0,255), 2)

    # 如需独立副本
    roi_copy = imgMat[50:200, 100:300].copy()
  ```

## 图像算术运算
* 图像添加
  - 两幅图像的深度和类型必须相同。
  ```js
    let src1 = cv.imread("canvasInput1");
    let src2 = cv.imread("canvasInput2");
    let dst = new cv.Mat();
    let mask = new cv.Mat();

    let dtype = -1;
    cv.add(src1, src2, dst, mask, dtype);
    src1.delete(); src2.delete(); dst.delete(); mask.delete();
  ```
* 图像相减
  - 两幅图像必须具有相同的深度和类型。
  ```js
    let src1 = cv.imread("canvasInput1");
    let src2 = cv.imread("canvasInput2");
    let dst = new cv.Mat();
    let mask = new cv.Mat();

    let dtype = -1;
    cv.subtract(src1, src2, dst, mask, dtype);
    src1.delete(); src2.delete(); dst.delete(); mask.delete();
  ```
* 位运算
  - 包括按位与、或、非和异或运算。它们在提取图像的任何部分、定义和处理非矩形感兴趣区域 (ROI) 等操作中非常有用。
  ```js
    let src = cv.imread('imageCanvasInput');
    let logo = cv.imread('logoCanvasInput');

    let dst = new cv.Mat();
    let roi = new cv.Mat();
    let mask = new cv.Mat();
    let maskInv = new cv.Mat();

    let imgBg = new cv.Mat();
    let imgFg = new cv.Mat();
    let sum = new cv.Mat();

    let rect = new cv.Rect(0, 0, logo.cols, logo.rows);
    // I want to put logo on top-left corner, So I create a ROI
    roi = src.roi(rect);

    // Create a mask of logo and create its inverse mask also
    cv.cvtColor(logo, mask, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(mask, mask, 100, 255, cv.THRESH_BINARY);
    cv.bitwise_not(mask, maskInv);

    // Black-out the area of logo in ROI
    cv.bitwise_and(roi, roi, imgBg, maskInv);

    // Take only region of logo from logo image
    cv.bitwise_and(logo, logo, imgFg, mask);

    // Put logo in ROI and modify the main image
    cv.add(imgBg, imgFg, sum);

    dst = src.clone();
    for (let i = 0; i < logo.rows; i++) {
        for (let j = 0; j < logo.cols; j++) {
            dst.ucharPtr(i, j)[0] = sum.ucharPtr(i, j)[0];
        }
    }
    cv.imshow('canvasOutput', dst);
    src.delete(); dst.delete(); logo.delete(); roi.delete(); mask.delete();
    maskInv.delete(); imgBg.delete(); imgFg.delete(); sum.delete();

  ```

## 常用的数据结构
> 在 js 中，Scalar 是数组类型。Point、Size、Circle、Rect 和 RotatedRect 是对象类型
* Point
  ```js
    // 第一种方法
    let point = new cv.Point(x, y);
    // 第二种方法
    let point = {x: x, y: y};
  ```
* Scalar
  ```js
    // The first way
    let scalar = new cv.Scalar(R, G, B, Alpha);
    // The second way
    let scalar = [R, G, B, Alpha];
  ```
* Size 
  ```js
    // The first way
    let size = new cv.Size(width, height);
    // The second way
    let size = {width : width, height : height};
  ```
* Circle
  ```js
    // The first way
    let circle = new cv.Circle(center, radius);
    // The second way
    let circle = {center : center, radius : radius};
  ```
* Rect
  ```js
    // The first way
    let rect = new cv.Rect(x, y, width, height);
    // The second way
    let rect = {x : x, y : y, width : width, height : height};
  ```
* RotatedRect
  ```js
    // size width and height of the rectangle.
    // The first way
    let rotatedRect = new cv.RotatedRect(center, size, angle);
    // The second way
    let rotatedRect = {center : center, size : size, angle : angle};
  ```

## 彩色图像处理
> 针对多通道（RGB、HSV、Lab等）的特殊处理。 OpenCV 中有超过 150 种颜色空间转换方法。研究最广泛使用的一种：RGB → 灰度。
* 常用的颜色空间
  - RGB 模型是一种加性色彩系统，源于红、绿、蓝，应用于阴极射线管（CRT）显示器，数字扫描仪、数字摄像机和显示设备
  - hsv:数字媒体通常采用
  - hsl、hsi 机器视觉大量使用
* cv2.cvtColor() 
  - 用于将图像从一个空间转换到另一个颜色空间
+ 案例
    ```js
        // 默认是rgb
        // cv.cvtColor (src, dst, code, dstCn = 0)
        let src = cv.imread('canvasInput');
        let dst = new cv.Mat();
        // You can try more different parameters
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
        cv.imshow('canvasOutput', dst);
        src.delete(); dst.delete();
    ```
    ```py
        # 载入图像
        # 默认是bgr图像格式
        image = cv2.imread('your_image.jpg')
        # 转换到灰度图像
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        # 转换到 HSV 颜色空间
        hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # 显示图像
        cv2.imshow('Original Image', image)
        cv2.imshow('Gray Image', gray_image)
        cv2.imshow('HSV Image', hsv_image)
        cv2.imshow('RGB Image', rgb_image)

        cv2.waitKey(0)
        cv2.destroyAllWindows()
    ```

## 图像的几何变换
> 图像的几何变换是指对图像像素坐标进行空间位置调整的操作，不改变像素值，仅改变像素的布局。常见的几何变换包括：缩放、旋转、平移、镜像、错切（倾斜）、仿射变换和透视变换等。它们在图像配准、矫正、数据增强、图像拼接等任务中必不可少。
* 图像缩放 (Resize)
  - 缩放是最基础的变换，改变图像的尺寸。示例将图像缩小为原来的一半
  ```js
    // cv.resize (src, dst, dsize, fx = 0, fy = 0, interpolation = cv.INTER_LINEAR )
    let src = cv.imread('canvasInput');
    let dst = new cv.Mat();
    let dsize = new cv.Size(0, 0);
    // You can try more different parameters
    cv.resize(src, dst, dsize, 0.5, 0.5, cv.INTER_LINEAR);
    cv.imshow('canvasOutput', dst);
    src.delete(); dst.delete();
  ```
  ```py
    # cv2.resize(src, dsize, fx, fy, interpolation)
    import cv2
    src = cv2.imread("image.jpg")
    dst = cv2.resize(src, None, fx=0.5, fy=0.5, interpolation=cv2.INTER_LINEAR)
  ```
* 图像旋转 (Rotation)
  - 通常以图像中心为旋转中心，需要先获得旋转矩阵，再进行仿射变换。
  - 示例：将图像顺时针旋转 45 度，保持尺寸不变（会裁剪或填充）
  ```js
    let src = cv.imread("imgElement");
    let center = new cv.Point(src.cols/2, src.rows/2);
    // getRotationMatrix2D（中心、角度、缩放）
    let M = cv.getRotationMatrix2D(center, -45, 1.0);
    let dst = new cv.Mat();
    let dsize = new cv.Size(src.cols, src.rows);

    cv.warpAffine(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    cv.imshow("canvas", dst);
    src.delete(); M.delete(); dst.delete();
  ```
  ```py
    import cv2
    import numpy as np
    src = cv2.imread("image.jpg")
    h, w = src.shape[:2]
    center = (w/2, h/2)

    M = cv2.getRotationMatrix2D(center, -45, 1.0)
    dst = cv2.warpAffine(src, M, (w, h), flags=cv2.INTER_LINEAR, borderValue=(0,0,0))
  ```
* 仿射变换 (Affine Transformation)
  - 仿射变换是线性变换（旋转、缩放、错切）加上平移，保持平行性（直线仍为直线）。可以通过三个对应点对求解变换矩阵。
  - 示例：将三角形区域映射到另一个三角形（错切效果）
  ```js
    let srcTri = [new cv.Point(50,50), new cv.Point(200,50), new cv.Point(50,200)];
    let dstTri = [new cv.Point(10,100), new cv.Point(200,50), new cv.Point(100,250)];
    let srcMat = cv.matFromArray(3,1,cv.CV_32FC2, ...);  // 需转为 Mat 格式
    let dstMat = cv.matFromArray(3,1,cv.CV_32FC2, ...);
    let M = cv.getAffineTransform(srcMat, dstMat);
    let dst = new cv.Mat();
    cv.warpAffine(src, dst, M, new cv.Size(src.cols, src.rows));
    // 释放所有 Mat
  ```
  ```py
    src_pts = np.float32([[50,50],[200,50],[50,200]])
    dst_pts = np.float32([[10,100],[200,50],[100,250]])
    M = cv2.getAffineTransform(src_pts, dst_pts)
    dst = cv2.warpAffine(src, M, (w, h))
  ```
* 透视变换 (Perspective Transformation)
  - 透视变换将图像投影到一个新的视平面，能实现“倾斜校正”效果。需要四个对应点对。
  - 示例：将一张照片中的矩形区域“拉正”为矩形
  ```js
    let srcPoints = [p1x,p1y, p2x,p2y, p3x,p3y, p4x,p4y];
    let dstPoints = [0,0, w,0, 0,h, w,h];
    let srcMat = cv.matFromArray(4,1,cv.CV_32FC2, srcPoints);
    let dstMat = cv.matFromArray(4,1,cv.CV_32FC2, dstPoints);
    let M = cv.getPerspectiveTransform(srcMat, dstMat);
    let dst = new cv.Mat();
    cv.warpPerspective(src, dst, M, new cv.Size(w, h));
    // 释放 M, srcMat, dstMat, dst
  ```
  ```py
    src_pts = np.float32([[x1,y1],[x2,y2],[x3,y3],[x4,y4]])
    dst_pts = np.float32([[0,0],[w,0],[0,h],[w,h]])
    M = cv2.getPerspectiveTransform(src_pts, dst_pts)
    dst = cv2.warpPerspective(src, M, (w, h))
  ```
* 常用插值方法对比
  + 所有变换都需指定插值算法：
    -  插值标志	       说明	        速度	质量
    - INTER_NEAREST	  最近邻	    最快   最差（锯齿）
I   - NTER_LINEAR	  双线性（默认）  快	较好
    - INTER_CUBIC	  双三次	     慢	   更好
    - INTER_LANCZOS4  Lanczos 插值	最慢   最好

## 图像阈值分割
* 核心原理与主要方法
  - 阈值分割本质上是对图像内每个像素点的灰度值与某个特定值（即阈值 T）进行比较判断，以决定其归属
* 常见的实现方法
  - 全局阈值：对整张图像使用单一阈值进行分割，算法简单、计算速度快
  - 自适应阈值：基于每个像素的局部邻域信息（如均值、高斯加权）计算不同的阈值，能有效克服光照不均的影响
  - Otsu（大津法）：通过最大类间方差来自动计算“最佳”的全局阈值，避免了手动选择阈值，实现了自动化
  - 多阈值分割：使用多个阈值将像素划分到不同类别中
* 案例
  ```py
    import cv2

    #  Otsu (全局阈值) 实现
    img = cv2.imread('input.jpg', cv2.IMREAD_GRAYSCALE)
    # 使用 OTSU 标志自动计算最佳全局阈值
    _, binary = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    cv2.imshow('Otsu', binary)
    cv2.waitKey(0)

    # 自适应阈值实现
    adaptive = cv2.adaptiveThreshold(img, 255, 
                                 cv2.ADAPTIVE_THRESH_MEAN_C,  # 使用均值计算
                                 cv2.THRESH_BINARY, 11, 2)  # 邻域大小=11, 常数C=2
  ```
  ```js
    // Otsu (全局阈值) 实现
    // cv.threshold（src，dst，thresh，maxval，type）
    let src = cv.imread(imgElement); 
    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY); // 转为灰度图

    let dst = new cv.Mat();
    // 应用于灰度图,当cv.THRESH_OTSU或cv.THRESH_TRIANGLE标志被启用时，输入图像必须为单通道图像。
    cv.threshold(gray, dst, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
    cv.imshow('canvasOutput', dst);

    // 手动释放内存
    src.delete(); gray.delete(); dst.delete();

    // 自适应阈值实现
    let dst = new cv.Mat();
    cv.adaptiveThreshold(gray, dst, 255, 
                        cv.ADAPTIVE_THRESH_MEAN_C,  // 使用均值计算
                        cv.THRESH_BINARY, 11, 2);
  ```
  
## 图像平滑
> 是一种经典的图像预处理技术，主要用于减少图像中的噪声和抑制不必要的细节，使图像变得柔和或模糊。它在去噪、特征增强前的预处理、以及图像压缩等场景中扮演关键角色。
* 基本原理
  - 本质上是一个低通滤波过程：保留图像中变化缓慢的低频成分，衰减变化剧烈的高频成分（如噪声、边缘、纹理）。在空间域中，通常通过卷积（或相关）操作实现：用一个小的核（kernel）遍历图像每个像素，将邻域像素的加权平均值作为输出。
  + 平滑操作的核心权衡
    - 去噪能力：滤波窗口越大，去噪越强，但图像细节（边缘、纹理）丢失越多。
    - 计算效率：大核或复杂的权重计算（如高斯、双边）会增加耗时。
* 常见图像平滑方法
  - 均值滤波:盒状核，所有权重相等,简单、快速；边缘模糊严重,快速去噪、图像缩放预处理
  - 高斯滤波:高斯分布的权重，中心权重最大,平滑更自然，保留边缘稍好,通用去噪、梯度计算前的平滑
  - 中值滤波:用邻域像素的中位数代替	非线性，完美去除椒盐噪声；保护边缘	椒盐噪声、脉冲噪声去除
  - 双边滤波:空间域+灰度域高斯权重	保边去噪；参数多，计算慢	美容磨皮、高保真去噪
  - 快速均值漂移滤波:基于颜色/空间距离的聚类	强平滑同时保留大边缘	图像分割前的预处理
* 代码示例
  ```py
    import cv2
    import numpy as np

    img = cv2.imread('noisy_image.jpg')

    # 均值滤波 (5x5)
    blur_mean = cv2.blur(img, (5,5))

    # 高斯滤波 (5x5, sigma=1)
    blur_gauss = cv2.GaussianBlur(img, (5,5), 1)

    # 中值滤波 (5x5)
    blur_median = cv2.medianBlur(img, 5)

    # 双边滤波 (d=9, sigmaColor=75, sigmaSpace=75)
    blur_bilateral = cv2.bilateralFilter(img, 9, 75, 75)

    cv2.imshow('Original', img)
    cv2.imshow('Mean', blur_mean)
    cv2.imshow('Gaussian', blur_gauss)
    cv2.imshow('Median', blur_median)
    cv2.imshow('Bilateral', blur_bilateral)
    cv2.waitKey(0)
  ```
  ```js
    // 假设已加载opencv.js，且有html img元素和canvas
    let src = cv.imread(imgElement);
    let dst = new cv.Mat();

    // 均值滤波
    let ksize = new cv.Size(5,5);
    cv.blur(src, dst, ksize);
    cv.imshow('canvasOutput', dst);

    // 高斯滤波
    cv.GaussianBlur(src, dst, ksize, 1);
    cv.imshow('canvasOutput', dst);

    // 中值滤波
    cv.medianBlur(src, dst, 5);
    cv.imshow('canvasOutput', dst);

    // 双边滤波
    cv.bilateralFilter(src, dst, 9, 75, 75);
    cv.imshow('canvasOutput', dst);

    src.delete(); dst.delete();
  ```
  
## 图像增强（Image Enhancement）
* 目的：改善图像的视觉效果，突出感兴趣的信息，同时抑制噪声。不关心图像退化的物理原因。
* 方法
  - 灰度变换（对比度拉伸、直方图均衡化）
  - 空间域滤波（平滑、锐化、高斯滤波、中值滤波）
  - 频率域滤波（低通、高通、同态滤波）
  - 彩色增强（伪彩色、颜色平衡）

## 图像复原（Image Restoration）
* 目的：利用退化过程的先验知识，尽可能恢复原始图像。与增强的区别在于有明确的退化模型（如模糊、运动、噪声）。
* 方法举例：
  - 逆滤波、维纳滤波
  - 盲去卷积
  - 噪声去除（高斯噪声、椒盐噪声模型）
  - 去模糊、去雾、去抖动

## 图像压缩与编码（Image Compression & Coding）
* 目的：减少表示图像所需的数据量，便于存储和传输。
* 方法：
  - 无损压缩（游程编码、Huffman、LZW、PNG）
  - 有损压缩（JPEG、JPEG2000、WebP）
  - 变换编码（DCT、小波变换）
  - 矢量量化、预测编码

## 图像分割（Image Segmentation）
* 目的：将图像划分为互不相交的区域，提取出感兴趣的目标或前景。
* 方法：
  - 阈值分割（Otsu、自适应阈值）
  - 边缘检测（Sobel、Canny、Laplacian）
  - 区域生长、分水岭算法
  - 聚类（K‑means、均值漂移）
  - 图割（Graph Cut）、深度学习语义分割（U‑Net、Mask R‑CNN）

## 图像特征提取与描述（Feature Extraction & Description）
* 目的：从图像中提取出有区分度的信息，用于识别、匹配或分类。
* 方法：
  - 点特征（Harris角点、FAST、SIFT、SURF、ORB）
  - 边缘与轮廓（Hough变换、链码）
  - 纹理特征（LBP、GLCM、Gabor滤波器）
  - 全局特征（颜色直方图、HOG、LBP）

## 图像分析与理解（Image Analysis & Understanding）
* 目的：对图像内容进行更高层次的解释，常涉及机器学习。
* 子领域：目标检测、目标识别、图像分类、场景理解、行为识别、图像描述生成（Captioning）。
* 常用技术：深度学习（CNN、Transformer）、支持向量机、决策树等。

## 图像重建与合成（Image Reconstruction & Synthesis）
* 目的：从投影或部分数据重建完整图像，或生成新的图像内容。
* 方法：
  - 计算机断层扫描（CT）、磁共振成像（MRI）重建
  - 超分辨率重建（SRCNN、ESPCN）
  - 图像修复（inpainting）
  - 图像生成（GAN、扩散模型）
