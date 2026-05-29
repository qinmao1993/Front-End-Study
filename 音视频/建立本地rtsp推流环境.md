# 本地搭建推流环境
用本地摄像头（比如笔记本内置摄像头或USB摄像头）模拟网络摄像头进行RTSP推流，方便后续的协议转换和网页端播放开发

## 环境准备
* 安装 FFmpeg
* 安装 MediaMTX

## 步骤
1. 查看本地摄像头设备名
  ```bash
    # windows (使用DirectShow) 输出中 "USB2.0 HD UVC WebCam" 这类带引号的内容就是摄像头名称。
    ffmpeg -list_devices true -f dshow -i dummy

    # macOS (使用AVFoundation) 会列出视频设备和音频设备，例如 [0] FaceTime HD Camera。
    ffmpeg -f avfoundation -list_devices true -i ""

    # Linux (使用V4L2) 通常设备文件是 /dev/video0
    v4l2-ctl --list-devices
    # 或者用 ffmpeg 列出来
    ffmpeg -f v4l2 -list_formats all -i /dev/video0
  ```
2. 启动RTSP服务器
  + 在解压后的 MediaMTX 文件夹内打开终端（Linux/macOS）或命令提示符（Windows），运行： 
    - Windows: mediamtx.exe
    - macOS/Linux: ./mediamtx
  - 如果一切正常，你会看到类似 [RTSP] listener opened on :8554 (TCP) 的日志，代表服务器已启动，准备接收推流。
3. 用FFmpeg推流到RTSP服务器
  ```bash
    # windows
    ffmpeg -f dshow -i video="你的摄像头名称" -c:v libx264 -preset ultrafast -tune zerolatency -f rtsp rtsp://127.0.0.1:8554/mystream

    # macOS
    ffmpeg -f avfoundation -framerate 25 -video_size 1280x720 -i "0" -c:v libx264 -preset ultrafast -tune zerolatency -an -f rtsp rtsp://127.0.0.1:8554/mystream

    # Linux
    ffmpeg -f v4l2 -i /dev/video0 -c:v libx264 -preset ultrafast -tune zerolatency -f rtsp rtsp://127.0.0.1:8554/mystream

    # 执行后，如果 FFmpeg 窗口持续输出 frame=... fps=... 等信息，就说明推流正在进行。
  ```
  + 命令说明
    - -preset ultrafast -tune zerolatency：牺牲少量压缩率换取极低延迟，对实时监控非常关键。
    - rtsp://127.0.0.1:8554/mystream：这是推流的目标地址，mystream 是你自定义的流名称，可以随意更改。
    - -an 禁用音频流 
4. 验证RTSP流
  - 方式1：使用VLC播放器：打开 VLC → 媒体 → 打开网络串流 → 输入地址 rtsp://127.0.0.1:8554/mystream，点击播放。能看到实时画面即成功。
  - 方式2：使用FFplay（FFmpeg附带）：终端执行 ffplay rtsp://127.0.0.1:8554/mystream
  + 方式3：用webRTC 协议打开
    - 在浏览器打开用webRTC 协议打开，延迟更低 http://127.0.0.1:8889/mystream/
    - 如果软件支持 WHEP，则可以使用以下 URL 从服务器读取数据流：http://localhost:8889/mystream/whep
    - WHEP 是 WebRTC 的一个扩展，它允许直接使用 URL 读取数据流，而无需经过网页

