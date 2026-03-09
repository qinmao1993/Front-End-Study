# python 打包成客户端

## 客户端打包器
> PyInstaller、cx_Freeze 和 py2exe 都是用于将 Python 代码打包成可执行文件的工具，它们之间有一些相似之处，也有一些不同之处。下面是它们之间的一些对比：

1. PyInstaller：
   - PyInstaller 是一个跨平台的工具，可以在 Windows、Linux 和 macOS 上使用。
   - 它能够将整个 Python 应用程序和其依赖项打包成单个可执行文件，不需要安装 Python 解释器。
   - 支持将 Python 2 和 Python 3 的代码打包成可执行文件。
   - PyInstaller 对第三方库的支持相对较好。

2. cx_Freeze：
   - cx_Freeze 也是一个跨平台的工具，可以在 Windows、Linux 和 macOS 上使用。
   - 类似于 PyInstaller，它可以将 Python 应用程序及其依赖项打包成单个可执行文件，无需安装 Python 解释器。
   - 在处理一些特定的依赖项时可能会比 PyInstaller 更灵活一些，但也更复杂一些。

3. py2exe：
   - py2exe 主要用于将 Python 应用程序打包成 Windows 可执行文件（.exe 文件）。
   - 与 PyInstaller 和 cx_Freeze 不同，py2exe 主要针对 Windows 平台，不支持 Linux 和 macOS。
   - 虽然它的跨平台性不如前两者，但在 Windows 平台上的打包效果可能会更好。
   
## pyinstaller
> 运行在windows8+, macOS 10.15+
1. 安装: pip install pyinstaller
2. 在项目目录下运行 pyinstaller your_program.py
  - 输出 your_program.spec 的打包配置文件
  - pyinstaller myscript.spec 使用配置文件打包应用程序
3. myscript.spec
  ```py
  # myscript.spec

    # 根据需要修改的选项
    a = Analysis(
    ['myscript.py'],
      pathex=['path/to/script']
      binaries=[],
      datas=[],
      hiddenimports=[],
      hookspath=[],
      runtime_hooks=[],
      excludes=[],
      cipher=block_cipher,
      noarchive=False
     )

    # 打包选项
    pyz = PYZ(a.pure, a.zipped_data,cipher=block_cipher)

    exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          [],
          name='myscript',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          runtime_tmpdir=None,
          console=False)
    coll = COLLECT(exe,
          a.binaries,
          a.zipfiles,
          a.datas,
          strip=False,
          upx=True,
          upx_exclude=[],
          name='dist')
  ```
  + Analysis 对象用于指定要打包的文件和路径，
    - binaries（要包含的二进制文件）、
    - datas（要包含的数据文件）
    - hiddenimports（要包含的隐藏导入模块）
  + EXE 表示生成的可执行文件
    - name：指定生成的可执行文件的名称。
    - debug：是否生成调试模式的可执行文件。
    - console：是否显示控制台窗口。
  + COLLECT 对象用于指定收集生成文件时的选项，比如是否启用压缩、是否排除特定的文件等。