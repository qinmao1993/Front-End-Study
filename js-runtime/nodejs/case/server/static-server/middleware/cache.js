class CacheMiddleware {
  constructor(config) {
    this.config = config.performance.cache;
  }
  
  /**
   * 处理缓存验证
   */
  handleCacheValidation(req, res, stats) {
    if (!stats || !this.config.etag || !this.config.lastModified) {
      return false;
    }
    
    // 生成 ETag
    const etag = this.generateETag(stats);
    res.setHeader('ETag', etag);
    res.setHeader('Last-Modified', stats.mtime.toUTCString());
    
    // 检查 If-None-Match
    const ifNoneMatch = req.headers['if-none-match'];
    if (ifNoneMatch && ifNoneMatch === etag) {
      res.writeHead(304);
      res.end();
      return true;
    }
    
    // 检查 If-Modified-Since
    const ifModifiedSince = req.headers['if-modified-since'];
    if (ifModifiedSince) {
      const modifiedSince = new Date(ifModifiedSince);
      if (stats.mtime <= modifiedSince) {
        res.writeHead(304);
        res.end();
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * 设置缓存控制头部
   */
  setCacheHeaders(res, filePath, stats) {
    const cacheControl = [];
    
    // 最大年龄
    if (this.config.maxAge > 0) {
      cacheControl.push(`max-age=${this.config.maxAge}`);
    }
    
    // 公共缓存
    cacheControl.push('public');
    
    // 不可变缓存
    if (this.config.immutable) {
      cacheControl.push('immutable');
    }
    
    // 必须重新验证
    cacheControl.push('must-revalidate');
    
    res.setHeader('Cache-Control', cacheControl.join(', '));
    
    // 过期时间
    if (this.config.maxAge > 0) {
      const expires = new Date(Date.now() + this.config.maxAge * 1000);
      res.setHeader('Expires', expires.toUTCString());
    }
  }
  
  /**
   * 生成 ETag
   */
  generateETag(stats) {
    const mtime = stats.mtime.getTime().toString(16);
    const size = stats.size.toString(16);
    return `"${size}-${mtime}"`;
  }
  
  /**
   * 处理 Range 请求
   */
  handleRangeRequest(req, res, stats, content) {
    const rangeHeader = req.headers['range'];
    if (!rangeHeader || !rangeHeader.startsWith('bytes=')) {
      return { content, ranges: null };
    }
    
    const fileSize = stats.size;
    const ranges = this.parseRangeHeader(rangeHeader, fileSize);
    
    if (!ranges || ranges.length === 0) {
      res.setHeader('Content-Range', `bytes */${fileSize}`);
      res.writeHead(416);
      res.end();
      return { handled: true };
    }
    
    // 单范围请求
    if (ranges.length === 1) {
      const range = ranges[0];
      const chunk = content.slice(range.start, range.end + 1);
      
      res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${fileSize}`);
      res.setHeader('Content-Length', chunk.length);
      res.writeHead(206);
      
      return { content: chunk, ranges, handled: false };
    }
    
    // 多范围请求
    return this.handleMultiRange(req, res, content, ranges, fileSize);
  }
  
  /**
   * 解析 Range 头部
   */
  parseRangeHeader(rangeHeader, fileSize) {
    const ranges = [];
    const parts = rangeHeader.replace(/bytes=/, '').split(',');
    
    for (const part of parts) {
      const [startStr, endStr] = part.split('-').map(s => s.trim());
      
      let start = parseInt(startStr, 10);
      let end = parseInt(endStr, 10);
      
      if (isNaN(start) && !isNaN(end)) {
        // 格式: "-500" 表示最后500字节
        start = fileSize - end;
        end = fileSize - 1;
      } else if (!isNaN(start) && isNaN(end)) {
        // 格式: "500-" 表示从500字节到结尾
        end = fileSize - 1;
      }
      
      // 验证范围
      if (!isNaN(start) && !isNaN(end) && 
          start >= 0 && end < fileSize && start <= end) {
        ranges.push({ start, end });
      }
    }
    
    return ranges;
  }
  
  /**
   * 处理多范围请求
   */
  handleMultiRange(req, res, content, ranges, fileSize) {
    const boundary = `boundary_${Date.now()}_${Math.random().toString(36).substr(2)}`;
    const contentType = `multipart/byteranges; boundary=${boundary}`;
    
    let multipartBody = '';
    
    for (const range of ranges) {
      const chunk = content.slice(range.start, range.end + 1);
      
      multipartBody += `\r\n--${boundary}\r\n`;
      multipartBody += `Content-Type: ${req.headers['accept'] || 'application/octet-stream'}\r\n`;
      multipartBody += `Content-Range: bytes ${range.start}-${range.end}/${fileSize}\r\n\r\n`;
      multipartBody += chunk.toString('binary');
    }
    
    multipartBody += `\r\n--${boundary}--\r\n`;
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', Buffer.byteLength(multipartBody));
    res.writeHead(206);
    
    return { content: Buffer.from(multipartBody, 'binary'), ranges, handled: false };
  }
}

export default CacheMiddleware;