import base64
import os

# os.getcwd()当前工作目录
img_path = os.path.join(os.getcwd(), "public/imgs/t1.jpg")

print("img_path:", img_path)


# 读取图片文件
with open(img_path, "rb") as image_file:
    # 将图片内容读取为字节流
    image_data = image_file.read()
    # 使用 base64 模块进行编码
    base64_data = base64.b64encode(image_data)
    # 将字节流转换为字符串
    base64_str = base64_data.decode('utf-8')

# 打印 Base64 编码的字符串（部分输出）
print(base64_str[:50] + '...')
