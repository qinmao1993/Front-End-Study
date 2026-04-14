from os import getcwd, path
import cv2
import numpy as np

# 图像属性和数据类型

# 图像的颜色分类
# 二值图像：只有黑和白，像素点用0/1 或 0/255 表示 0是黑色 1或255白色
# 灰度图像：像素点用8位数字[0,255]表示灰度级 0 是纯黑 255纯白
# 彩色图像：bgr 三个颜色通道组合表示，像素点3个8位[0,255]表示红绿蓝

# 数字图像是由像素点组成的矩阵来表示
# opencv 中的二值图像用二维数组表示（h,w）
# opencv 中的彩色图像用三维数组表示 (h,w,ch) ch表示通道数

# opencv 中的图像数据结构是 Numpy 数组，所以 Numpy数组的所有属性和操作方法都适用
# img.ndim  图像的维数，彩色3 灰度 2
# img.shape 图像形状（h,w,ch）图像的行数（高度）图像列数（宽度）和通道数，返回一个表示图像维度的元组
# img.size 数组元素的总数

# 1. 获取图片宽高
img_path = path.join(getcwd(), "public/input/imgs/t1.jpg")
bgr_img = cv2.imread(img_path)
# 截取这个元组的前两个元素
h, w = bgr_img.shape[:2]

# 2. 图像的创建与复制

# 2.1 创建一个黑色空白图像
# np.zeros 创建一个全零的数组，表示黑色图像。
# dtype=np.uint8 表示每个像素值在 0 到 255 之间（8 位无符号整数）。
height, width = 512, 512
black_image = np.zeros((height, width, 3), dtype=np.uint8)

# 2.2 创建一个彩色图像
# np.ones 创建一个全1的数组，通过乘以 255 将所有像素值设置为 255（白色）
white_image = np.ones((height, width, 3), dtype=np.uint8) * 255


# 2.3 拷贝图像，深拷贝，复制的图像改变时，原图像不会改变
# 方式一
original_image = cv2.imread("path_to_image.jpg")
copied_image = original_image.copy()

# 方式二
copied_image = np.copy(original_image)

# 3. 图像的裁剪与拼接

# 3.1 图像的裁剪
# 数组切片,裁剪图像的指定区域
# img[y:y+h,x:x+w].copy()

image = cv2.imread("path_to_image.jpg")

# 定义裁剪区域 (y_start, y_end, x_start, x_end)
y_start, y_end, x_start, x_end = 50, 200, 100, 300

# 裁剪图像
cropped_image = image[y_start:y_end, x_start:x_end]

# 3.2 图像拼接
# 图像拼接是将多个图像合并成一个更大的图像。可以是水平拼接或垂直拼接。
image1 = cv2.imread("path_to_image1.jpg")
image2 = cv2.imread("path_to_image2.jpg")

# 确保两个图像的高度相同
if image1.shape[0] != image2.shape[0]:
    raise ValueError("图像的高度必须相同才能水平拼接")

# 水平拼接图像
horizontal_concat = np.hstack((image1, image2))

# 确保两个图像的宽度相同
if image1.shape[1] != image2.shape[1]:
    raise ValueError("图像的宽度必须相同才能垂直拼接")

# 垂直拼接图像
vertical_concat = np.vstack((image1, image2))

# 4. 图像通道的拆分与合并

# 4.1 图像通道的拆分
# 读取彩色图像
image = cv2.imread("path_to_image.jpg")
# 方式一：split 拆分通道
b, g, r = cv2.split(image)

# 方式二：使用 numpy 拆分通道:
b, g, r = image[:, :, 0], image[:, :, 1], image[:, :, 2]

# 4.2 图像通道的合并
# 假设 b, g, r 是拆分的通道
merged_image = cv2.merge([b, g, r])

# 假设 b, g, r 是拆分的通道
merged_image = np.stack([b, g, r], axis=-1)


# 5. 获取与修改像素值（马赛克处理原理）
image = cv2.imread("path_to_image.jpg")
# 获取特定像素的值 (y, x)
pixel_value = image[100, 150]  # 返回 BGR 通道的值
image[100, 150] = [0, 255, 0]  # 设置为绿色 (BGR)

def apply_mosaic(image, block_size):
    """对图像应用马赛克效果"""
    height, width, _ = image.shape
    mosaic_image = np.zeros_like(image)

    # 遍历图像并应用马赛克效果 
    # 可以调整块的大小以获得不同的马赛克效果
    for y in range(0, height, block_size):
        for x in range(0, width, block_size):
            # 定义当前块的边界
            end_y = min(y + block_size, height)
            end_x = min(x + block_size, width)
            # 获取当前块的子图像
            block = image[y:end_y, x:end_x]
            # 计算当前块的平均颜色
            average_color = block.mean(axis=(0, 1), dtype=int)
            # 将平均颜色填充到马赛克图像中
            mosaic_image[y:end_y, x:end_x] = average_color
    return mosaic_image

# 6. 快速的LUT替换像素值
