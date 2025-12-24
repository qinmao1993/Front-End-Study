# 浏览器中的API

## DOM 操作API
[DOM 操作 API](./dom.md)

## Bom 操作API
[Bom操作 API](./bom.md)

## 存储 API
[存储 API](./本地存储.md)

## 网络API
* [fetch-xhr](./Fetch-XHR.md)
* [webSocket](./websocket/websocket.md)

## 地理位置API
* navigator.geolocation：用于获取用户的地理位置
  ```js
    if (window.navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                console.log(position);
            },
            function (error) {
                console.log(error);
            }
        );
    }
    // 	当成功获取地理信息后，会调用 succssCallback，并返回一个包含位置信息的对象position.Coord(坐标)
    //     1. coords.latitude：估计纬度
    // 　　2. coords.longitude：估计经度
    // 　　3. coords.altitude：估计高度
    // 　　4. coords.accuracy：所提供的以米为单位的经度和纬度估计的精确度
    // 　　5. coords.altitudeAccuracy：所提供的以米为单位的高度估计的精确度
    // 　　6. coords.heading： 宿主设备当前移动的角度方向，相对于正北方向顺时针计算
    // 　　7. coords.speed：以米每秒为单位的设备的当前对地速度
    //     当获取地理信息失败后，会调用errorCallback，并返回错误信息error
    //     可选参数 options 对象可以调整位置信息数据收集方式
    navigator.geolocation.watchPosition(success, error)
  ```

## 访问设备的方向和运动传感器
  ```js
    // 设备方向
    window.addEventListener('deviceorientation', event => {
    console.log('Alpha:', event.alpha); // Z轴旋转
    console.log('Beta:', event.beta);   // X轴旋转
    console.log('Gamma:', event.gamma); // Y轴旋转
    });

    // 设备运动
    window.addEventListener('devicemotion', event => {
    console.log('加速度:', event.acceleration);
    });
  ```

## 多媒体API
* [视频](/音视频/视频技术.md)
* [音频](/音视频/音频技术.md)

## File API
[文件api](/开发语言/js/图像与二进制.md)

## Web Workers API
[web-workers](./web-workers.md)

## MessageChannel
* 同源的不同浏览器上下文间通信。
* [MessageChannel](./MessageChannel.md)

## requestIdleCallback
* 把埋点、日志丢进浏览器空闲时间，首帧零阻塞。
[requestIdleCallback](./requestIdleCallback.md)

## ResizeObserver
* 精准监听任意 DOM 宽高变化，图表自适应、虚拟滚动必备。
[ResizeObserver](./ResizeObserver.md)

## IntersectionObserver 
* 检测元素进出视口，
  - 应用场景：懒加载 + 曝光埋点，性能零损耗
[IntersectionObserver](./IntersectionObserver.md)

## Page Visibility
* 侦测标签页隐藏，自动暂停视频、停止轮询，移动端省电神器。
  ```js
    document.addEventListener('visibilitychange', () =>
      document.hidden ? video.pause() : video.play()
    );
  ```
  
## Web Share
* 一键唤起系统分享面板，直达微信、微博、Telegram，需 HTTPS。
  ```js
    navigator.share?.({ title: '好文', url: location.href });
  ```

## Wake Lock
* 锁定屏幕常亮，直播、PPT、阅读器不再自动息屏。
  ```js
    await navigator.wakeLock.request('screen');
  ```

## Notification API
  ```js
    // 请求权限
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Hello!', {
            body: '这是一个通知',
            icon: '/icon.png'
        });
      }
    });
  ```

## Clipboard API
[Clipboard](./clipboard.md)

## Performance API
  ```js
    // 测量代码执行时间
    performance.mark('start');
    // 执行一些操作...
    performance.mark('end');
    performance.measure('myMeasurement', 'start', 'end');

    // 获取性能指标
    const navigationTiming = performance.getEntriesByType('navigation')[0];
      console.log(
        "导航耗时:",
        navigationTiming.responseStart - navigationTiming.navigationStart
    );
    console.log(
        "服务器响应耗时:",
        navigationTiming.responseEnd - navigationTiming.requestStart
    );
    // 衡量页面开始呈现并能与用户交互的时间
    console.log(
        "DOM 加载耗时:",
        navigationTiming.domContentLoadedEventEnd -
            navigationTiming.domContentLoadedEventStart
    );
    // 加载所有资源（如图片、样式等）所花费的时间。
    console.log(
        "Load 加载完整耗时:",
        navigationTiming.loadEventEnd - navigationTiming.loadEventStart
    );
  ```
