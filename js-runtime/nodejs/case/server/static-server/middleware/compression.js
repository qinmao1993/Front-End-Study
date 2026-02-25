const zlib = require('zlib');
const util = require('util');

class CompressionMiddleware {
  constructor(config) {
    this.config = config.performance.compression;
    this.compressors = {
      gzip: util.promisify(zlib.gzip),
      deflate: util.promisify(zlib.deflate),
      br: util.promisify(zlib.brotliCompress)
    };
  }
  
  /**
   * 压缩响应内容
   */
  async compressResponse(req, res, content, contentType) {
    // 检查是否启用压缩
    if (!this.config.enabled || content.length < this.config.threshold) {
      return { content, encoding: null };
    }
    
    // 检查客户端支持的编码
    const acceptEncoding = req.headers['accept-encoding'];
    if (!acceptEncoding) {
      return { content, encoding: null };
    }
    
    // 解析支持的编码
    const supportedEncodings = this.parseAcceptEncoding(acceptEncoding);
    
    // 尝试按优先级压缩
    for (const encoding of supportedEncodings) {
      // 检查是否支持该压缩算法
      if (!this.compressors[encoding] || (encoding === 'br' && !this.config.brotli)) {
        continue;
      }
      
      try {
        const compressed = await this.compressors[encoding](content, {
          level: this.config.level
        });
        
        // 如果压缩后的数据更大，则返回原始数据
        if (compressed.length >= content.length) {
          continue;
        }
        
        return {
          content: compressed,
          encoding
        };
      } catch (error) {
        console.warn(`Compression failed for ${encoding}:`, error.message);
        continue;
      }
    }
    
    return { content, encoding: null };
  }
  
  /**
   * 解析 Accept-Encoding 头部
   */
  parseAcceptEncoding(acceptEncoding) {
    const encodings = [];
    const parts = acceptEncoding.toLowerCase().split(',').map(e => e.trim());
    
    for (const part of parts) {
      const [encoding, q = '1'] = part.split(';q=');
      const quality = parseFloat(q);
      
      if (quality > 0) {
        encodings.push({
          name: encoding,
          quality
        });
      }
    }
    
    // 按质量降序排序
    encodings.sort((a, b) => b.quality - a.quality);
    
    return encodings.map(e => e.name);
  }
  
  /**
   * 设置压缩头部
   */
  setCompressionHeaders(res, encoding) {
    if (encoding) {
      res.setHeader('Content-Encoding', encoding);
      res.setHeader('Vary', 'Accept-Encoding');
    }
  }
}

export default CompressionMiddleware;