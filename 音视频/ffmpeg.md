# ffmpeg
> ffmpeg 是一个开源的多媒体处理工具，广泛用于音频、视频和流媒体的处理、转码、录制和播放等任务。它提供了强大的命令行工具集，可以在不同的操作系统上运行。
## 主要功能和应用场景
* 音视频转码和处理：
  - 支持几乎所有主流的音视频编解码器和格式，可以进行转码、压缩、裁剪、合并等操作。
  - 可以调整分辨率、帧率、比特率等参数，适应不同的播放环境和设备要求。
* 流媒体处理：
  - 支持从网络摄像头、音频输入设备和其他多媒体源中捕获和编码数据。
  - 可以生成 HTTP Live Streaming (HLS)、Dynamic Adaptive Streaming over HTTP (DASH) 等流媒体协议
* 录制和截取：
  - 可以录制桌面、摄像头或者流媒体，并且支持设置录制区域、时长和质量。
  - 能够从视频中截取特定片段或者从音频中提取特定段落。
* 音视频处理效果：
  - 支持添加滤镜、水印、字幕等特效，提升视听体验。
  - 可以调整色彩、亮度、对比度等视觉效果，增强或修改音频效果。
* 直播和流媒体服务器：
  - 可以配置为流媒体服务器，支持实时转码和流式传输，满足实时直播和点播的需求。

## 命令中的参数解析
* 参数设置格式
  + ffmpeg [全局选项] -i input.mp4 [输入文件选项] [音频/视频过滤器] [输出文件选项] output.mp4
    - 全局选项：会影响整个 FFmpeg 运行环境，如 -loglevel（日志级别）、-hwaccel cuda（硬件加速）、-threads（线程数）等
    - 输入文件选项：-f（指定输入格式）、-codec:v（视频编解码器）、-codec:a（音频编解码器）、-pix_fmt（像素格式）等
    - 输入文件：指定要处理的输入文件或输入流。
    - 音频/视频过滤器：如果需要对音频或视频进行滤镜处理（如裁剪、调整大小、添加水印等），如视频滤镜 -vf 和音频滤镜 -af。
    - 输出文件选项：这些选项指定输出文件的特性，如 -f（指定输出格式）、-codec:v（视频编码器）、-codec:a（音频编码器）、-preset（编码质量预设）等
    - 输出文件：指定生成的输出文件或输出流的名称和路径。output.mp4 是指定的输出文件名。

* 输入设定
  + -f 
    - rawvideo: 声明输入格式为原始视频帧。
  - -video_size  简写 -s [WIDTHxHEIGHT]: 设定输入视频的分辨率大小 
  - -framerate  简写-r [FPS]: 输入视频的帧率，一般不设置默认是自动侦测 
  + -i: 指定输入的源
    - - 从标准输入读取
    - input_video.mp4: 输入视频文件的路径
  - -re: 以原始的实时速率读取输入流，适合直播
  - -maxrate 3000k 最大比特率
  - -bufsize 6000k: 缓冲区大小设置

* 输出设定
  - -y: 强制覆盖输出文件，如果输出文件已经存在，则不会提示用户确认覆盖，而是直接覆盖输出文件。
  - -c:v libx264: 使用x264编码器进行视频编码。
  + -preset: 设置编码速度，以降低延迟
    - ultrafast 极快
    - veryfast
  - -b:v 2000k  设置视频编码的比特率，2000k 这是一个常见的值，适用于许多在线视频流媒体的标准。
  - -tune zerolatency: 设置编码器以零延迟模式工作，以最小化延迟。
  - -crf 23：视频质量设置，数值越低质量越高，取值范围一般是 0 到 51，推荐范围 18-28。
  - -g 60: 关键帧间隔，通常设置为帧率的倍数，例如帧率为30fps时设置为60。对于 HLS 流，关键帧设置很重要。

  + -pix_fmt：设置视频编码器使用的图像格式（如RGB还是YUV）
    - yuv420p:是一种颜色编码格式，常用于视频压缩和流式传输，尤其是在Web视频中常见
    - rgb24: 使用 RGB 色彩空间，每个像素使用 24 位（8 位红、8 位绿、8 位蓝）来表示。这种格式通常用于处理和编辑需要精确颜色表示的图像和视频。
    - rgba: 类似于 rgb24，但每个像素包括一个额外的 Alpha 通道（透明度通道），用于表示像素的不透明度
    - gray: 灰度图像，只有一个亮度分量（Y），没有色度分量。
    - nv12, nv21: 这两种格式也是 YUV 色彩空间的一种变体，通常用于特定的硬件编码和解码场景。

  + -f 指定输出格式
    - flv
    - hls
  
  + hls 格式输出
    - -hls_time 10 设置 HLS 分段时长为 10 秒。
    - -hls_list_size 0 不限制 HLS 列表文件中的分段数量
    + -hls_flags 
      - -hls_flags discont_start+delete_segments+round_durations+temp_file 启用了多个 -hls_flags，确保生成的 HLS 流更加健壮和可靠。
      - delete_segments: 这个选项告诉ffmpeg在生成HLS流时删除已经过期的片段（segments）
      - split_by_time：  根据时间间隔而不是文件大小来分割分段。
    - -hls_segment_filename 'output_%03d.ts' 设置分段文件名格式。

* 输入输出设定
  - -pix_fmt（取决于位置）: 指定视频帧的像素格式，像素格式是描述像素如何编码的方式，包括颜色空间、位深度、存储顺序等信息
  ```bash
    # 输入设定：指定了输入文件的像素格式
    ffmpeg -i input.mp4 -pix_fmt yuv420p output.mp4
    # 输出设定：指定了输出文件或流的像素格式
    ffmpeg -i input.mp4 -c:v libx264 -pix_fmt yuv420p output.mp4
  ```
  
## 快速查看常用参数
  ```bash
  # 查看所有选项信息
  ffmpeg --help full

  # 查看FLV的封装
  ffmpeg -h muxer=flv

  # 查看编码
  ffmpeg -h encoder=libx264

  # 查看 当前安装的 FFmpeg 中是否涵盖了 nvidia 的 H.264 编码器
  ffmpeg -encoders|grep H.264

  ```

## 应用：音视频转码和处理
  ```bash
    # 转码视频为H.264格式：
    ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 192k output.mp4
  ```

## 应用：录制和截取
  ```bash
    # 查找摄像头设备
    # mac (使用AVFoundation) 会列出视频设备和音频设备，例如 [0] FaceTime HD Camera。
    ffmpeg -f avfoundation -list_devices true -i ""
    # windows (使用DirectShow) 输出中 "USB2.0 HD UVC WebCam" 这类带引号的内容就是摄像头名称。
    ffmpeg -list_devices true -f dshow -i dummy
    # Linux (使用V4L2) 通常设备文件是 /dev/video0
    v4l2-ctl --list-devices

    # 采集本机摄像头的视频
    # Linux 
    ffmpeg -f v4l2 -i /dev/video0 -c:v libx264 -preset ultrafast -pix_fmt yuv420p output.mp4
    # mac 
    # -i "0" 取索引为0 的设备
    # -r 25：设置帧率为 25fps,
    # -t 10：设置录制时长为 10秒（可选）。
    ffmpeg -f avfoundation -i "0" -r 25 -t 10 output.mp4
    # windows 
    ffmpeg -f dshow -i video="你的摄像头名称" -c:v libx264 -preset ultrafast -pix_fmt yuv420p output.mp4
    # Linux 录制桌面视频:
    ffmpeg -f x11grab -framerate 30 -video_size 1920x1080 -i :0.0 output.mp4


    # 从视频中提取音频：
    ffmpeg -i input.mp4 -vn -c:a copy output_audio.aac

  ```

## 应用：流媒体处理
  ```bash
    # 将视频转换为HLS流：
    ffmpeg -i input.mp4 -c:v libx264 -pix_fmt yuv420p -c:a aac -strict -2 -f hls output.m3u8

    # 使用ffmpeg将帧转换为实时流
    # -f mpegts http://xxx.xxx 适用于基于 HTTP 的流媒体服务器，如 HLS 或 DASH。MPEG-TS 是一个容错性强的格式，适合网络传输和直播
    # -f flv rtmp://IP/live/stream：适用于 RTMP 流媒体服务器。FLV（Flash Video）格式通常用于低延迟的实时流媒体传输，如直播流。
    ffmpeg -f rawvideo -pixel_format bgr24 -video_size 720x640 -framerate 30 -i - -c:v libx264 -preset fast -tune zerolatency -f mpegts http://localhost:[PORT]/stream

    # 推流
    # 检测rtmp服务有没有在运行，没输出表示在运行
    netstat -an | grep 1935

    # -re：以实时速度读取输入（适用于推流）。
    ffmpeg -re -i input_video.mp4 -c:v libx264 -preset veryfast -tune zerolatency  -pix_fmt yuv420p -f flv "rtmp://127.0.0.1/live/stream"

    # mac 本机摄像头采集画面推流（只推画面）
    #  -vf "hflip" 镜像 -video_size 简写 -s、  -framerate 简写 -r -an 禁用音频流 
    # 输出 hls -f flv rtmp://127.0.0.1/hls/stream
    ffmpeg -f avfoundation -r 25 -s 1280x720 -i "0" -c:v libx264 -preset ultrafast -tune zerolatency  -pix_fmt yuv420p  -an  -f flv rtmp://127.0.0.1/live/stream

    # 远程监控摄像头
    # 如：rtsp://username:password@camera_ip:port/stream
    ffmpeg -i "<rtsp_url>" -c:v libx264 -preset ultrafast -tune zerolatency -f flv rtmp://127.0.0.1/live/stream

    # 使用硬件加速
    ffmpeg -hwaccel cuda -f rawvideo -pixel_format bgr24 -video_size 720x640 -framerate 30 -i - -c:v h264_nvenc -preset fast -tune zerolatency -f mpegts http://localhost:[PORT]/stream
  ```

## 应用：音视频处理效果
  - TODO

## 硬件加速
>在使用硬件加速时，确保您的系统上已经安装了相应的驱动程序和库
* NVIDIA GPU 加速 (CUDA)
  ```bash
    ffmpeg -i input.mp4 -c:v h264_nvenc -preset fast -b:v 5000k -f flv rtmp://server/stream

  ```
* Intel QuickSync 加速
  ```bash
    ffmpeg -i input.mp4 -c:v h264_qsv -preset fast -b:v 5000k -f flv rtmp://server/stream

  ```
* AMD VCE
  ```bash
    ffmpeg -i input.mp4 -c:v h264_amf -b:v 5000k -f flv rtmp://server/stream
  ```

## ffmpeg 中的模块
* AvFormat
  - 封装与解封装，传输协议的框架
* Avcodec 
  - 编码、解码的框架与子模块
* Avfilter
  - 滤镜模块与视频、音频、字幕的特效处理
* Avdevice
  - 输入、输出外设框架与设备模块
* Swscale
  - 视频图像的缩放与色彩转换
* Swresample
  - 音频的采样与重采样处理
  
## ffplay
* 推流到媒体服务器后，拉流观看的方式
```bash
  # 预览摄像头画面
  # Linux
  ffplay -f v4l2 /dev/video0
  # Macos -vf "hflip" 镜像翻转
  ffplay -f avfoundation -i "0" -vf "hflip" -framerate 25
  # windows
  ffplay -f dshow -i video="设备名称"

  # 播放远程的摄像头画面 
  # RTSP 端口通常是 554
  ffplay rtsp://<IP_ADDRESS>:<PORT>/
  ffplay rtsp://username:password@<IP_ADDRESS>:<PORT>/

  # 拉流播放
  ffplay -vf "drawtext=text='%{eif\:mod(n\,60)\:d}':x=10:y=10:fontsize=24:fontcolor=white"  rtmp://127.0.0.1/live/stream  
  ffplay http://localhost:8082/hls/stream/index.m3u8
```

## ffprobe
> 多媒体信息分析器，它是 FFmpeg 提供的一个工具，能够用来分析音视频容器格式、音视频流信息、音视频包以及音视频帧等信息，在我们做音视频转码、故障分析时，这个工具提供很大的帮助
* 常见用法
  ```bash
    # 基本文件信息
    ffprobe filename.mp4

    # 详细信息：
    ffprobe -v verbose filename.mp4

    # -show_streams 分析音视频流:以JSON格式输出分析信息
    # -show_format  分析音视屏容器格式
    # -show_packets 分析音视频包
    # -show_frames  分析音视频帧

    ffprobe -v quiet -print_format json -show_format -show_streams filename.mp4

  ```