# docker 部署
假设服务器已内置 docker 环境

## 准备本地镜像环境
  TODO
  ```bash
    # 将指定镜像 demo 保存成 tar 文件
    docker save -o demo.tar demo
  ```
## 在服务端机器上载入镜像
 ```bash
  docker load -i  demo.tar
  docker image ls

  ```


  