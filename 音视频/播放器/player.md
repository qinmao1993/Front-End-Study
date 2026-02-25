# 播放器
常用前端开源的播放器对比

## video.js
Video.js 是一个开源的 HTML5 视频播放器框架，支持现代浏览器和设备，提供一致的跨平台视频播放体验。
* 主要特性
  - 跨浏览器兼容
  - 自定义控件界面:字幕、播放速率、画中画、全屏、音频轨道
  - 插件丰富
  - 自适应各种屏幕尺寸、移动设备友好
* 支持的流媒体协议
  - 支持标准 HTTP/HTTPS 视频文件，支持 MP4、WebM、OGG 等容器格式
    ```js
        // 基本 HTTP 视频
        player.src('http://example.com/video.mp4');
        // HTTPS 视频
        player.src('https://example.com/video.mp4');
    ```
  - 新版已内置支持 HLS (HTTP Live Streaming)
  ```js
    // 使用 HLS
    player.src({
        src: 'https://example.com/stream.m3u8',
        type: 'application/x-mpegURL'
    });

    // 带多个质量级别的 HLS
    player.src({
        src: 'https://example.com/master.m3u8',
        type: 'application/x-mpegURL',
        withCredentials: true
    });
  ```
  - MPEG-DASH
  ```js
    // 使用 DASH
    player.src({
        src: 'https://example.com/manifest.mpd',
        type: 'application/dash+xml'
    });

    // DASH with DRM
    player.src({
        src: 'https://example.com/drm-manifest.mpd',
        type: 'application/dash+xml',
        keySystems: {
            'com.widevine.alpha': 'https://example.com/license'
        }
    });
  ```
  - RTMP(已逐渐淘汰)
  ```js
    // 支持插件: videojs-flash (需要 Flash 支持)
    // 使用 RTMP (传统协议)
    player.src({
        src: 'rtmp://example.com/live/stream',
        type: 'rtmp/flv'
    });

    // RTMPS (加密)
    player.src({
        src: 'rtmps://example.com/live/stream',
        type: 'rtmp/flv'
    });
  ```
  - WebRTC 流
  ```js
    // 使用 videojs-webrtc 插件
    import 'videojs-webrtc';
    player.src({
        src: 'webrtc://example.com/live',
        type: 'application/webrtc'
    });
  ```
* 安装
  ```bash
    npm i video.js
    # import videojs from 'video.js'
    # import 'video.js/dist/video-js.css'
  ```

## xgplayer（字节）
> 一个由字节跳动（ByteDance）前端团队开源、功能强大且高度模块化的 Web 视频播放器库
* 核心特点
  - 开源与免费
  - 模块化架构:它将播放器的核心（Core）与所有功能（如进度条、音量控制、画质切换、弹幕等）彻底解耦。可按需引入
  + 全面的格式支持
    - 点播： 完美支持 MP4、WebM 等常见格式。
    - 流媒体： 原生、高效地支持 HLS（.m3u8） 和 MPEG-DASH（.mpd）
    - 直播： 支持 HLS 和 FLV 直播（通过 flv.js 插件）
  + 支持移动端
    - 移动端（iOS/Android）做了大量适配和优化，能智能切换最适合当前平台的播放方案
  + 丰富的功能与插件生态
    - UI 组件： 提供了一套默认的、美观的、响应式的 UI 控件，同时允许深度自定义
    - 内置弹幕、画中画、截图、缩略图预览、倍速播放、记忆播放、快捷键 
* 对比 video.js
  - XGPlayer 更现代、模块化更彻底，对流媒体的原生支持更好。

## 监控流媒体播放器
### Jessibuca 
* 是一款开源的 Web 端流媒体播放器，专注于在浏览器中实现高性能、低延迟的实时音视频播放。它特别适用于监控、直播、视频对讲、在线教育等需要实时流媒体的场景。pro 版本要收费
* 核心特性与优势
  + 高性能解码
    - 支持 WebAssembly 技术，能够利用现代浏览器的性能进行高效解码
    - 兼容多种视频编码格式，如 H.264、H.265（HEVC）、AV1 等。
    - 支持音频格式如 AAC、G.711 等。
  + 超低延迟
    - 通过优化解码和渲染流程，可以实现 1秒以内 甚至 毫秒级 的极低延迟播放
  + 多协议支持
    - 支持多种流媒体传输协议，包括 WebSocket、HTTP-FLV、WebRTC 等，能够灵活适配不同的流媒体服务器。
  + 支持分屏播放

### 海康H5Player
* 核心特点：专为海康设备设计，易集成，兼容海康私有协议。
* 协议支持：主要支持WebSocket流
* 与海康设备兼容性最佳；提供分屏预览、录像回放等监控专用功能

### EasyPlayer.js
* 核心特点：功能全面的通用流媒体播放器，支持协议多。
* 协议支持：支持HLS、HTTP-FLV、WebRTC、WS-FLV等多种格式。
* 延迟水平：使用WASM解码可达到300ms以内的超低延迟。
* 关键优势/场景：超低延迟需求；需要播放多厂家设备或转换后的通用流

## Ijkplayer（B站）
> 是一个基于 FFmpeg 的轻量级、跨平台的 Android/iOS 视频播放器。
* 核心
  - 它将强大的 FFmpeg 多媒体处理库与平台原生播放器API（如 Android 的 MediaPlayer，iOS 的 AVPlayer）的优点相结合。
  - 旨在提供一个功能强大、兼容性好（支持多种封装格式和编码）、且易于集成的播放解决方案
* 现状与未来
  - ExoPlayer 崛起：ExoPlayer 的成熟和普及，让很多新项目不再优先选择 Ijkplayer。
  
## vlc
