# 发布一个自定义的包

## 步骤
1. 创建包的目录结构
  ```
  python-package/
    my_package/
        __init__.py
        module1.py
        module2.py
    tests/
        test_module1.py
        test_module2.py
    setup.py
    README.md
    LICENSE
    .gitignore

  ```
2. 创建 setup.py

3. 编写 README.md
  - README.md 文件用于描述你的包的功能、安装方法和使用示例。
```md

  # my_package

  A simple example Python package.

  ## Installation

  You can install the package using pip:

  ```bash
  pip install my_package
  ```


  ```py
    from my_package import function1, function2
    print(function1())
    print(function2())
  ```
```
4. 发布到 PyPI
  ```bash
    # 安装 twine（用于上传包到 PyPI）：
    pip install twine

    # 创建源分发包：
    python setup.py sdist

    # 上传包到 PyPI：
    twine upload dist/*
  ```
5. 验证安装
  ```bash
    pip install my_package
  ```
