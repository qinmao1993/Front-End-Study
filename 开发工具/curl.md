# curl

## curl 是什么？
  - curl是一个命令行访问URL的工具，作用是发出网络请求，然后得到和提取数据，显示在"标准输出"（stdout）上面
  - 额外还支持cookie特性，可以用curl完成web浏览器的基本功能，curl 还支持 HTTPS/FTP/FTPS/TELNET/LDAP等协议。

## 常用指令
```bash
  # 查看当前版本
  curl -V
  -v 详细输出，包含请求和响应的首部
  
  -o test 将指定curl返回保存为test文件，内容从html/jpg到各种MIME类型文件
      
  -X  是指定什么类型请求(POST/GET/HEAD/DELETE/PUT/PATCH)
    
  -c <file> 保存服务器的cookie文件
  
  -H <header:value>  为HTTP请求设置任意header及值
  
  -d 以post方式传送数据
  
  -O  把输出写到该文件中，保留远程文件的文件名

  -I 这个选项表示 curl 只获取 HTTP 响应的头部信息，而不会下载页面内容

```

## 示例
```bash
  # 查询当前网络ip
  curl ipinfo.io
  curl cip.cc

  # 不带参数的请求
  curl GET 'https://xxx.com/xxx'
  curl POST 'https://xxx.com/xxx'

  # post 表单请求
  curl -X POST -d 'a=1&b=nihao' URL
  # post json 请求
  curl -H "Content-Type: application/json" -X POST -d '{"abc":123,"bcd":"nihao"}' URL

  curl -H "Content-Type: application/json" -X POST -d @test.json URL

```