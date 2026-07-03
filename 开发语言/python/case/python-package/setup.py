# setup.py 是用来定义包的元数据和依赖关系的文件

from setuptools import setup, find_packages

setup(
    name='my_package',
    version='0.1.0',
    description='A simple example package',
    author='Your Name',
    author_email='your.email@example.com',
    license='MIT',
    # Package info
    packages=find_packages(),
    data_files=[],
    zip_safe=True,
    install_requires=[],  # 如果有依赖包，添加它们
    tests_require=['pytest'],  # 如果使用pytest进行测试
    python_requires='>=3.6',  # 适用的Python版本
    classifiers=[
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
    ],
)
