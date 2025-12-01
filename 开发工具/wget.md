# wget
wget 是一个强大的命令行下载工具，支持 HTTP、HTTPS 和 FTP 协议。以下是常用的用法和选项：

## 常用选项说明
-O：指定输出文件名

-c：断点续传

-b：后台下载

-q：安静模式

-r：递归下载

-l：递归深度

-np：不追溯到父目录

-k：转换链接用于本地查看

-p：下载页面所需的所有资源

-A：接受的文件类型

-R：拒绝的文件类型

-i：从文件读取 URL

--limit-rate：限制下载速度

-t：重试次数

-T：超时时间

## 常用命令
```bash
    # 下载单个文件
    wget https://example.com/file.zip

    # 指定保存文件名
    wget -O custom_name.zip https://example.com/file.zip

    # 继续未完成的下载
    wget -c https://example.com/large-file.iso

    # 后台运行（输出写入 wget-log）
    wget -b https://example.com/file.zip

    # 安静模式（无输出）
    wget -q https://example.com/file.zip

    # 限制下载速度为 200KB/s
    wget --limit-rate=200k https://example.com/file.zip

```

## 高级用法
```bash
    # 递归下载整个网站
    wget -r https://example.com/
    # 设置递归深度（例如 2 层）
    wget -r -l 2 https://example.com/
    # 不跨越父目录
    wget -r -np https://example.com/path/

    # 批量下载：从文件读取多个 URL
    wget -i urls.txt
    # 使用通配符（仅 FTP 服务器支持）
    wget ftp://example.com/files/*.zip

    # 重试次数（默认 20 次）
    wget -t 3 https://example.com/file.zip
    # 超时设置（秒）
    wget -T 30 https://example.com/file.zip
    # 下载限制大小（超过则放弃）
    wget --quota=100m https://example.com/files/

    # HTTP 认证
    wget --user=username --password=pass https://example.com/protected/
    # FTP 认证
    wget --ftp-user=user --ftp-password=pass ftp://example.com/file

    # 使用代理
    wget -e use_proxy=yes -e http_proxy=192.168.1.1:8080 https://example.com/
```

## 实用示例
```bash
    # 下载整个 WordPress 主题（包含所有资源）
    wget -r -l inf -k -p -E -np https://example.com/themes/theme-name/

    # 下载视频系列（文件命名有序）
    wget https://example.com/video/{1..10}.mp4

    # 监控下载进度
    wget --progress=bar:force:noscroll https://example.com/large-file.iso
```