# 获取命令行参数

# 在命令行中运行 python demo.py one two three 
# 输出的结果 ['demo.py', 'one', 'two', 'three']

import sys
print(sys.argv)

sys.stderr.write('Warning, log file not found starting a new one\n')

# 终止脚本
sys.exit()
