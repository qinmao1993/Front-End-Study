import cv2

# 1. 图像的颜色空间转换 opencv 默认是bgr图像格式

# 1）RGB 模型是一种加性色彩系统，源于红、绿、蓝 
# 应用于阴极射线管（CRT）显示器，数字扫描仪、数字摄像机和显示设备
# 2）hsv:数字媒体通常采用
# 3）hsl、hsi 机器视觉大量使用

# 2 cv2.cvtColor() 用于将图像从一个空间转换到另一个颜色空间
# 支持150多种转换类型
# 载入图像
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