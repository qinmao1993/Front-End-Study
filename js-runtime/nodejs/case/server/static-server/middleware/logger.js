class LoggerMiddleware {
  constructor(config) {
    this.config = config.logging;
    this.formats = {
      combined: ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
      common: ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]',
      dev: ':method :url :status :response-time ms - :res[content-length]',
      short: ':remote-addr :method :url HTTP/:http-version :status :res[content-length] - :response-time ms',
      tiny: ':method :url :status :res[content-length] - :response-time ms'
    };
  }
  
  /**
   * 记录请求日志
   */
  logRequest(req, res, startTime, additionalInfo = {}) {
    if (!this.config.enabled) return;
    
    const format = this.formats[this.config.format] || this.formats.combined;
    const logLine = this.formatLogLine(format, req, res, startTime, additionalInfo);
    
    this.writeLog(logLine, res.statusCode);
  }
  
  /**
   * 格式化日志行
   */
  formatLogLine(format, req, res, startTime, additionalInfo) {
    const responseTime = Date.now() - startTime;
    
    return format
      .replace(':remote-addr', req.socket.remoteAddress || '-')
      .replace(':remote-user', '-')
      .replace(':date[clf]', new Date().toUTCString())
      .replace(':method', req.method)
      .replace(':url', req.url)
      .replace(':http-version', req.httpVersion)
      .replace(':status', res.statusCode)
      .replace(':res[content-length]', res.getHeader('content-length') || '-')
      .replace(':referrer', req.headers.referer || req.headers.referrer || '-')
      .replace(':user-agent', req.headers['user-agent'] || '-')
      .replace(':response-time', responseTime)
      .replace(':request-id', additionalInfo.requestId || '-')
      .replace(':file-path', additionalInfo.filePath || '-');
  }
  
  /**
   * 写入日志
   */
  writeLog(message, statusCode) {
    const level = this.getLogLevel(statusCode);
    
    if (this.shouldLog(level)) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
      
      console.log(logMessage);
      
      // 可以在这里添加文件日志记录
      // this.writeToFile(logMessage);
    }
  }
  
  /**
   * 根据状态码确定日志级别
   */
  getLogLevel(statusCode) {
    if (statusCode >= 500) return 'error';
    if (statusCode >= 400) return 'warn';
    if (statusCode >= 300) return 'info';
    return 'info';
  }
  
  /**
   * 检查是否应该记录该级别的日志
   */
  shouldLog(level) {
    const levels = ['error', 'warn', 'info', 'debug'];
    const configLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex <= configLevelIndex;
  }
  
  /**
   * 记录错误
   */
  logError(error, req, additionalInfo = {}) {
    if (!this.config.enabled) return;
    
    const timestamp = new Date().toISOString();
    const errorInfo = {
      timestamp,
      requestId: additionalInfo.requestId,
      url: req.url,
      method: req.method,
      ip: req.socket.remoteAddress,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code
      }
    };
    
    console.error(`[${timestamp}] [ERROR]`, JSON.stringify(errorInfo));
  }
  
  /**
   * 记录访问统计
   */
  logStats(stats) {
    if (!this.config.enabled || this.config.level !== 'debug') return;
    
    const timestamp = new Date().toISOString();
    console.debug(`[${timestamp}] [STATS]`, JSON.stringify(stats));
  }
}