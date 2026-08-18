# docker 部署
假设服务器已内置 docker 环境

## 准备本地镜像环境
  ```bash
    # 将指定镜像 app 保存成 tar 文件
    docker build -t app:0.0.1 . 
    docker save -o app.tar app:0.0.1
  ```

## 在服务端机器上载入镜像
 ```bash
  docker load -i  app.tar
  docker image ls

  # 运行
  # 根据镜像文件app:0.0.1启动容器,并命名为c3，服务端口3000映射到宿主机8000
  docker run -p 8000:3000 --name=c3  app:0.0.1
  # 后台运行
  docker run -d -p 8000:3000 --name=c3  app:0.0.1

  # 应用意外崩溃,服务重启
  docker run -d -p 8000:3000 --name c3 --restart=always app:0.0.1
  # 进入容器终端
  docker run -p 8000:3000 -itd app:0.0.1 /bin/bash 

  docker container ls
  docker start c3

  ```


  