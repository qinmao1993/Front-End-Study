from os import getcwd, path
import cv2
import numpy as np
import requests
import matplotlib.pyplot as plt
print(cv2.__version__)


# 1. 图像的读取
# 语法：cv2.imread(filename,flags)
# 参数 filename 读取图像文件的路径和文件名，包括拓展名
# 参数 flags 指定了读取图像的方式
#     默认是 IMAGE_COLOR 表示3通道的BGR格式的彩色图像 1
#     IMAGE_GRAYSCALE 以灰度模式加载图像 0
#     IMREAD_UNCHANGED：原样加载图像，使用 alpha 通道 -1
#     返回值是多维的 Numpy 数组

# 注意：
# 在 opencv 中最常用的的图像数据结构是c++定义的 mat 类
# 在 python 语言中 Mat 类对象的创建和操作 是通过 Numpy 操作实现的，对图像的任何操作本质是对 Numpy 数组的运算

# 读取图像返回的是二维或三维的数组，灰图是二维，彩色是三维
# 无法读取图像，不会报错，返回的是空矩阵


# 读取案例1
# img_path = path.join(getcwd(), "public/input/imgs/t1.jpg")
# bgr_img = cv2.imread(img_path)
# gray_img = cv2.imread(img_path, flags=0)

# print("bgr_img:", bgr_img)
# cv2.imshow("test1", bgr_img)
# print("gray_img:", gray_img)
# cv2.imshow("test2", gray_img)

# 读取案例2：读取带中文路径
# imread 不支持带中文或空格的路径，确实需要可使用 cv.imdecode()
# 经测试 opencv 4.10 读取已经支持中文路径了
# cn_img_path = path.join(getcwd(), "public/input/imgs/中文路径/t1.jpg")
# print('cn_img_path:',cn_img_path)
# # cn_img = cv2.imread(cn_img_path)
# cn_img = cv2.imdecode(np.fromfile(cn_img_path, dtype=np.uint8),1)
# cv2.imshow("cn_img", cn_img)


# 读取案例3：读取网络地址的图片
def url_to_bgr(image_url):
    # 下载图片
    response = requests.get(image_url)
    image_data = response.content
    # 将图片数据转换为 NumPy 数组
    image_array = np.frombuffer(image_data, np.uint8)
    # 使用 OpenCV 解码图像
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    return image


# 是一个键盘绑定函数，它的参数是以毫秒为单位的时间。该函数为任意键盘事件等待指定毫秒
# cv2.waitKey(0)

# 2. 图像保存
# 经测试 opencv 4.10 保存已经支持中文路径了

# filename 保存文件路径
# img 多维 Numpy 数组
# params 图片编码参数

# imwrite(filename,img,params)
# 返回值是bool 保存是否成功

# img_path = path.join(getcwd(), "public/input/imgs/t1.jpg")
# bgr_img = cv2.imread(img_path)
# # cv2.imshow("cn_img", bgr_img)
# save_path = path.join(getcwd(), "public/dest/imgs/保存中文测试.png")
# save_result = cv2.imwrite(save_path, bgr_img)
# print("save_result:", save_result)


# 3. 图像显示
# 图像显示1：全屏展示
# img_path = path.join(getcwd(), "public/input/imgs/t1.jpg")
# bgr_img = cv2.imread(img_path)
# cv2.namedWindow("window_name", cv2.WINDOW_NORMAL)
# cv2.setWindowProperty("window_name", cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)
# cv2.imshow("window_name", bgr_img)

# cv2.waitKey(0) # 不自动关闭

# 图像显示2：Matplotlib
# Matplotlib 是一个强大的 Python 绘图库，用于创建各种类型的图形和图像
# pip install matplotlib

# 读取图像（BGR 格式）
img_path = path.join(getcwd(), "public/input/imgs/t1.jpg")
image_bgr = cv2.imread(img_path)
# 将图像从 BGR 转换为 RGB
image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

# 显示图像
plt.imshow(image_rgb)
plt.axis('off')  # 关闭坐标轴显示
plt.show()