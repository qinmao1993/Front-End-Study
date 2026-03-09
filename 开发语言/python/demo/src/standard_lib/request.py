# urllib 是 Python 的标准库之一，提供了处理 URL 请求的模块。
# 它包含了多个子模块，例如 urllib.request 用于发送请求，urllib.parse 用于解析 URL 等。由于是标准库，无需额外安装。
from urllib.request import urlopen

response = urlopen('https://api.example.com')
print(response.status)
print(response.read().decode())


# http.client 是 Python 的标准库之一，提供了底层的 HTTP 客户端功能。
# 它允许你以更底层的方式控制请求和响应，但相对来说使用起来稍微复杂一些。
import http.client

conn = http.client.HTTPSConnection('api.example.com')
conn.request('GET', '/')
response = conn.getresponse()
print(response.status)
print(response.read().decode())

