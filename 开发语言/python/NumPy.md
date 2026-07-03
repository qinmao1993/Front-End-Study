# NumPy
Python科学计算的基石，绝大多数的数据科学、机器学习库（如Pandas、Scikit-learn、TensorFlow）都直接或间接地构建在它之上。

## ndarray
* NumPy的核心是ndarray（N维数组）对象。
  - 它是一个高性能、同质化的数据容器，可以高效地存储和操作大规模的多维数据，比如一个灰度图可以是一个二维数组，而一段文本经过处理后可能变成一个二维甚至三维的数组
* 特点
  - 元素类型必须相同 
  - 内存存储连续内存，存取速度快
  - 向量化运算，由底层C/Fortran实现，性能极高
* 适用场景
  - 大规模数值计算、科学计算、矩阵运算

## 核心用法与实战示例
* 数组创建
  ```py
    import numpy as np

    # 从列表创建
    arr1 = np.array([1, 2, 3])         # 一维数组 [1 2 3]

    # 内置快速创建函数
    zeros = np.zeros((2, 3))           # 2x3的全0浮点数组
    ones = np.ones((3, 2), dtype=int)  # 3x2的全1整数数组

    # 序列创建
    seq_arr = np.arange(0, 10, 2)      # 从0开始，步长为2 [0 2 4 6 8]
    lin_arr = np.linspace(0, 1, 5)     # 0到1之间等间隔取5个数

    # 随机数创建
    random_arr = np.random.rand(2, 3)  # 2x3的[0,1)均匀分布随机数
    randn_arr = np.random.randn(2, 3)  # 2x3的标准正态分布随机数
    int_arr = np.random.randint(0, 10, size=(2, 3)) # 2x3的[0,10)随机整数
  ```
* 数组属性
  ```py
    print(arr1.shape)   # (3,) 输出数组的形状
    print(zeros.ndim)   # 2 输出数组的维度数
    print(ones.dtype)   # int32 输出数组元素的数据类型
    print(seq_arr.size) # 5 输出数组元素的总个数
  ```
* 数组索引与切片
  ```py
    # 索引
    a = np.array([[1, 2, 3], [4, 5, 6]])
    print(a[0, 1])   # 2，访问第0行第1列
    print(a[-1])     # [4 5 6]，访问最后一行

    # 切片 [start:stop:step]
    print(a[0, 1:3]) # [2 3]，第0行的第1到2列（不包括3）
    print(a[:, :2])  # [[1 2], [4 5]]，所有行的前两列
    print(a[::2, :]) # [[1 2 3]]，步长为2取行，取所有列

    # 布尔索引
    b = np.array([1, 2, 3, 4, 5])
    mask = b > 3
    print(b[mask])   # [4 5]，提取所有大于3的元素
  ```
* 数组形状操作
  ```py
    # 重塑形状
    a = np.arange(6)          # [0 1 2 3 4 5]
    reshaped = a.reshape(2, 3) # 重塑为2x3的矩阵
    # [[0 1 2]
    #  [3 4 5]]

    # 转置
    transposed = reshaped.T    # 转置为3x2的矩阵
    # [[0 3]
    #  [1 4]
    #  [2 5]]

    # 展平数组
    flattened = reshaped.flatten() # 展平为一维数组 [0 1 2 3 4 5]
  ```
* 数学运算
  > 这是NumPy的精髓，直接对数组进行运算，代码简洁且高效。
  ```py
    a = np.array([1, 2, 3])
    b = np.array([4, 5, 6])

    # 逐元素运算
    print(a + b)          # [5 7 9]
    print(a * b)          # [4 10 18]
    print(a ** 2)         # [1 4 9]
    print(np.sqrt(a))     # [1.         1.41421356 1.73205081]

    # 矩阵乘法
    A = np.array([[1, 2],[3,4]])
    B = np.array([[5, 6],[7,8]])
    print(A @ B)          # 等同于 np.dot(A, B) -> [[19 22], [43 50]]
  ```
* 聚合函数
  > 用于计算数组的统计信息。
  ```py
    data = np.array([1, 2, 3, 4, 5, 6])
    print(data.sum())          # 21
    print(data.mean())         # 3.5
    print(data.max())          # 6
    print(data.argmax())       # 5 (最大值索引)
    print(np.median(data))     # 3.5
    print(data.std())          # 1.707825127659933 (标准差)

    # 可以对多维数组指定轴(axis)进行计算
    matrix = np.array([[1, 2], [3, 4]])
    print(matrix.sum(axis=0))  # [4 6] (对行求和，即按列计算)
    print(matrix.sum(axis=1))  # [3 7] (对列求和，即按行计算)
  ```
* 高级功能：广播（Broadcasting）
  > 这是NumPy一个非常强大且独特的功能。当两个不同形状的数组进行运算时，NumPy会自动复制和扩展数组，使它们的形状匹配，从而完成运算。
  ```py
    # 一个3x3矩阵与一个1x3向量相加
    matrix = np.ones((3, 3))
    vector = np.array([1, 2, 3])
    result = matrix + vector
    # 广播过程：vector被“扩展”成和matrix一样的形状(3x3)
    # [[1, 2, 3], 
    #  [1, 2, 3], 
    #  [1, 2, 3]]
    # 然后逐元素相加
    print(result)
    # [[2. 3. 4.],
    #  [2. 3. 4.],
    #  [2. 3. 4.]]
  ```
* 线性代数
  > NumPy内置了 linalg（线性代数）模块，提供了丰富的矩阵运算功能，这正是深度学习的基础。
  ```py
    from numpy import linalg as LA
    A = np.array([[1, 2], [3, 4]])
    B = np.array([[5, 6], [7, 8]])

    # 矩阵乘法
    print(A @ B)  # 或 np.dot(A, B)

    # 矩阵的逆
    print(LA.inv(A))

    # 求解线性方程组 Ax = b
    A = np.array([[3,1], [1,2]])
    b = np.array([9,8])
    x = LA.solve(A, b)

    print(x) # [2. 3.] 即x=2, y=3
    # 特征值
    eigenvalues, eigenvectors = LA.eig(A)
    print(eigenvalues)
  ```
* 输入输出（I/O）
  > 可以方便地将数组数据保存到磁盘或从磁盘加载。
  ```py
    # 保存单个数组为.npy文件
    arr = np.array([1, 2, 3])
    np.save('my_array.npy', arr)

    # 加载 .npy 文件
    loaded_arr = np.load('my_array.npy')

    # 保存多个数组到一个压缩文件
    np.savez('my_archive.npz', a=arr, b=loaded_arr)

    # 加载 .npz 文件
    archive = np.load('my_archive.npz')
    print(archive['a'])
    
    # 处理文本文件
    np.savetxt('data.txt', arr)
    txt_data = np.loadtxt('data.txt')
  ```