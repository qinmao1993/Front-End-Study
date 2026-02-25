import StaticServer from './server.js';

// 自定义配置
const testConfig = {
  server: {
    port: 8080,
    host: 'localhost'
  },
  static: {
    root: './public',
    index: ['index.html', 'index.htm'],
    dotfiles: 'ignore',
    extensions: false,
    fallback: 'index.html'
  },
  directory: {
    enabled: true,
    icons: true
  }
};

// 创建并启动测试服务器
const server = new StaticServer(testConfig);

server.start().then(() => {
  console.log('Test server started successfully!');
  
  // 示例：在一段时间后停止服务器
  // setTimeout(() => {
  //   server.stop();
  // }, 60000);
});