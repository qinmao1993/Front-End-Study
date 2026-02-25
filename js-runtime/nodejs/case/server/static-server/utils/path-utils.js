const path = require('path');
const url = require('url');

class PathUtils {
  constructor(rootDir) {
    this.rootDir = path.resolve(rootDir);
  }
  
  /**
   * 检查路径是否安全（防止目录遍历）
   */
  isPathSafe(requestedPath) {
    const relative = path.relative(this.rootDir, requestedPath);
    return !relative.startsWith('..') && !path.isAbsolute(relative);
  }

  /**
   * 解析 Range 请求头
   */
  parseRangeHeader(rangeHeader, fileSize) {
    if (!rangeHeader || !rangeHeader.startsWith('bytes=')) {
      return null;
    }
    
    const ranges = [];
    const rangeParts = rangeHeader.replace(/bytes=/, '').split(',');
    
    for (const part of rangeParts) {
      const [start, end] = part.split('-').map(num => num.trim());
      
      let startByte = parseInt(start, 10);
      let endByte = parseInt(end, 10);
      
      if (isNaN(startByte)) {
        startByte = fileSize - endByte;
        endByte = fileSize - 1;
      } else if (isNaN(endByte)) {
        endByte = fileSize - 1;
      }
      
      // 验证范围有效性
      if (startByte >= 0 && endByte < fileSize && startByte <= endByte) {
        ranges.push({ start: startByte, end: endByte });
      }
    }
    
    return ranges.length > 0 ? ranges : null;
  }
}