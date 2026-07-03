# 字符串模式匹配
import re

re.findall(r"\bf[a-z]*", "which foot or hand fell fastest")
# 匹配结果： ['foot', 'fell', 'fastest']

re.sub(r"(\b[a-z]+) \1", r"\1", "cat in the the hat")
#  'cat in the hat'

# 简单功能使用 replace
"tea for too".replace("too", "two")
# 'tea for two'
