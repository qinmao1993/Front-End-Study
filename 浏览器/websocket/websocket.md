# websocket

## websocket
> WebSocket是一种在单个TCP连接上进行全双工通信的协议。它允许客户端和服务器之间进行双向通信，以实现实时数据传输。WebSocket通常用于实时聊天应用程序、大部分现代浏览器端支持，无需插件
  ```js
    // 创建 WebSocket 连接
    const socket = new WebSocket('ws://www.example.com/socketserver');

    // 连接成功时的回调函数
    socket.onopen = function(event) {
        console.log('WebSocket 已连接');
        
        // 发送消息
        socket.send('Hello, Server!');
    };

    // 接收到消息时的回调函数
    socket.onmessage = function(event) {
        console.log('接收到消息：' + event.data);
    };

    // 连接关闭时的回调函数
    socket.onclose = function(event) {
        console.log('WebSocket 已关闭');
    };

    // 发生错误时的回调函数
    socket.onerror = function(error) {
        console.error('WebSocket 错误：' + error);
    };

  ```

## Socket.io(推荐使用)：
  - Socket.io 是一个提供实时、双向通信的库，它支持 WebSocket 连接以及其他传输协议，如轮询和长轮询。Socket.io 提供了许多功能，包括自动重新连接、广播、命名空间和房间管理等。
  - Socket.io 是一个基于 Node.js 的库，支持客户端和服务器端的实现，而且它可以与各种前端框架和后端技术集成。
  - Socket.io 不仅支持 WebSocket 协议，还支持其他传输协议，如轮询和长轮询，这使得它在某些情况下比纯粹的 WebSocket 更具灵活性。

