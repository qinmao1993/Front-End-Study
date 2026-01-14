import SparkMD5 from 'spark-md5'

/**
 * ChunkedUploader — 一个面向浏览器的文件分片上传最佳实践封装
 * 设计目标：可配置的分片大小、并发、重试、进度事件、取消/暂停、断点续传支持、可插拔上传实现
 *
 * 使用要点：
 * - 支持传入自定义的 `uploadFn`（接收 FormData / chunk 信息并返回 Promise），以便与任意后端兼容
 * - 默认使用 XMLHttpRequest 以获得上传进度（upload progress）和可取消能力
 * - 支持 `getUploadedChunks(fileHash)` 钩子以实现断点续传
 * - 提供 `start()`, `pause()`, `resume()`, `abort()` 等控制方法
 */

export default class ChunkedUploader {
  /**
   * @param {Object} options
   * @param {File} options.file - 要上传的文件（必需）
   * @param {number|string} [options.chunkSize='2MB'] - 每一片的大小，支持字符串（"2MB"）或字节数
   * @param {number} [options.concurrent=3] - 并发上传数量
   * @param {number} [options.retryTimes=3] - 单个分片最大重试次数
   * @param {Function} [options.uploadFn] - 自定义上传函数：async ({chunk, index, fileHash, chunkHash, meta, signal}) => {}
   * @param {Function} [options.getUploadedChunks] - 可选：async (fileHash) => Array<index>
   * @param {Object} [options.headers] - 全局请求头（仅用于内置 uploadFn）
   */
  constructor(options = {}) {
    this.file = options.file
    if (!this.file) throw new Error('file is required')

    this.chunkSize = ChunkedUploader.parseSize(options.chunkSize ?? '2MB')
    this.concurrent = options.concurrent ?? 3
    this.retryTimes = options.retryTimes ?? 3

    this.uploadFn = options.uploadFn ?? this._defaultUploadFn.bind(this)
    this.getUploadedChunks = options.getUploadedChunks
    this.headers = options.headers || {}

    // 状态
    this.chunks = []
    this.totalChunks = 0
    this.fileHash = null
    this._listeners = {}
    this._abortControllers = new Set()
    this._xhrSet = new Set() // 为了进度/取消支持（默认实现）

    this._paused = false
    this._running = false
    this._uploadedBytes = 0
    this._totalBytes = this.file.size

    // 预拆分元数据（同步构建，哈希稍后计算）
    this._buildChunksMeta()
  }

  // ========== 事件系统 ===========
  on(event, cb) {
    if (!this._listeners[event]) this._listeners[event] = new Set()
    this._listeners[event].add(cb)
  }
  off(event, cb) {
    if (!this._listeners[event]) return
    this._listeners[event].delete(cb)
  }
  emit(event, payload) {
    const set = this._listeners[event]
    if (!set) return
    for (const cb of set) {
      try {
        cb(payload)
      } catch (e) {
        console.error(e)
      }
    }
  }

  // ========== 构建分片元数据（同步） ===========
  _buildChunksMeta() {
    const chunks = []
    let cur = 0
    let idx = 0
    while (cur < this.file.size) {
      const end = Math.min(cur + this.chunkSize, this.file.size)
      const blob = this.file.slice(cur, end)
      chunks.push({ file: blob, index: idx++, start: cur, end, size: blob.size, hash: null })
      cur = end
    }
    this.chunks = chunks
    this.totalChunks = chunks.length
  }

  // ========== 哈希计算 ===========
  /**
   * 计算整个文件 MD5（增量读取，避免一次性 OOM）
   * @returns {Promise<string>}
   */
  async computeFileHash() {
    const chunkSize = this.chunkSize
    const file = this.file
    const spark = new SparkMD5.ArrayBuffer()
    let cur = 0
    while (cur < file.size) {
      const blob = file.slice(cur, cur + chunkSize)
      const buffer = await this.blobToArrayBuffer(blob)
      spark.append(buffer)
      cur += chunkSize
    }
    return spark.end()
  }

  computeChunkHash(index) {
    const chunk = this.chunks[index]
    if (!chunk) return null
    const spark = new SparkMD5.ArrayBuffer()
    // 返回 promise 以便在需要时异步处理
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = () => reject(new Error('Chunk read error'))
      reader.onload = (e) => {
        spark.append(e.target.result)
        resolve(spark.end())
      }
      reader.readAsArrayBuffer(chunk.file)
    })
  }

  blobToArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Blob read error'))
      reader.readAsArrayBuffer(blob)
    })
  }

  /** 预计算所有分片的哈希 */
  async prepareAllChunkHashes() {
    for (const c of this.chunks) {
      if (!c.hash) {
        const buffer = await this.blobToArrayBuffer(c.file)
        const spark = new SparkMD5.ArrayBuffer()
        spark.append(buffer)
        c.hash = spark.end()
        this.emit('chunk-hash', { index: c.index, hash: c.hash })
      }
    }
  }

  // ========== 默认上传函数（使用 XHR 以支持进度） ===========
  /**
   * 默认上传函数：以 FormData POST 单个分片。
   * 支持返回 status-like semantics；用户也可以提供自己的 uploadFn
   */
  _defaultUploadFn({ file, index, totalChunks, fileHash, chunkHash, fileName, signal }) {
    const url = '/api/upload/chunk' // 默认端点，建议用户传入自定义函数或覆盖
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('chunk', file)
      formData.append('chunkIndex', index)
      formData.append('totalChunks', totalChunks)
      formData.append('fileHash', fileHash)
      formData.append('chunkHash', chunkHash)
      formData.append('filename', fileName)

      const xhr = new XMLHttpRequest()
      if (signal) {
        signal.addEventListener('abort', () => xhr.abort(), { once: true })
      }

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100
          this.emit('chunk-progress', { index, percent, loaded: e.loaded, total: e.total })
        }
      }

      xhr.onload = () => {
        this._xhrSet.delete(xhr)
        if (xhr.status >= 200 && xhr.status < 300)
          resolve({ ok: true, status: xhr.status, body: xhr.responseText })
        else reject(new Error(`Upload failed ${xhr.status}`))
      }
      xhr.onerror = () => {
        this._xhrSet.delete(xhr)
        reject(new Error('Network error'))
      }
      xhr.ontimeout = () => {
        this._xhrSet.delete(xhr)
        reject(new Error('Timeout'))
      }

      xhr.open('POST', url, true)
      // 设置自定义 header
      for (const k in this.headers) xhr.setRequestHeader(k, this.headers[k])
      xhr.timeout = 60000
      this._xhrSet.add(xhr)
      xhr.send(formData)
    })
  }

  // ========== 并发上传控制 ===========
  async _worker(queue, fileHash, totalChunks) {
    while (queue.length && !this._paused && this._running) {
      const chunkMeta = queue.shift()
      const { index, file } = chunkMeta

      // 若服务器已存在该分片则跳过（由外部在生成 queue 时过滤）
      let retry = 0
      while (retry <= this.retryTimes) {
        if (this._paused || !this._running) return
        if (this._aborted) throw new Error('aborted')

        // 每次上传都使用新的 AbortController 以支持取消本次请求
        const controller = new AbortController()
        const { signal } = controller
        this._abortControllers.add(controller)

        try {
          const chunkHash = chunkMeta.hash
          await this.uploadFn({
            file,
            index,
            totalChunks,
            fileHash,
            chunkHash,
            fileName: this.file.name,
            signal
          })

          // 成功
          this._uploadedBytes += chunkMeta.size
          this.emit('progress', {
            percent: (this._uploadedBytes / this._totalBytes) * 100,
            uploadedBytes: this._uploadedBytes,
            totalBytes: this._totalBytes
          })
          this._abortControllers.delete(controller)
          break
        } catch (err) {
          this._abortControllers.delete(controller)
          if (err.name === 'AbortError' || err.message === 'aborted' || this._aborted)
            throw new Error('Upload aborted')
          retry++
          if (retry > this.retryTimes) throw err
          await this._sleep(1000 * retry)
        }
      }
    }
  }

  _sleep(ms) {
    return new Promise((res) => setTimeout(res, ms))
  }

  // ========== 控制方法 ===========
  async start({ mergeUrl } = {}) {
    if (this._running) throw new Error('already running')
    this._running = true
    this._aborted = false
    this._paused = false

    try {
      // 1. 计算 fileHash（可选步骤，如果后端不需要可跳过）
      this.fileHash = await this.computeFileHash()
      this.emit('file-hash', { fileHash: this.fileHash })

      // 2. 算出已上传 chunk（断点续传）
      const existSet = new Set()
      if (typeof this.getUploadedChunks === 'function') {
        const arr = await this.getUploadedChunks(this.fileHash)
        if (Array.isArray(arr)) arr.forEach((i) => existSet.add(i))
      }

      // 3. 预计算 chunk hashes
      await this.prepareAllChunkHashes()

      // 4. 准备队列并发起上传
      const toUpload = this.chunks.filter((c) => !existSet.has(c.index))
      const queue = [...toUpload]
      const workers = []
      for (let i = 0; i < this.concurrent; i++)
        workers.push(this._worker(queue, this.fileHash, this.totalChunks))
      await Promise.all(workers)

      // 5. 合并
      if (mergeUrl) {
        await fetch(mergeUrl, {
          method: 'POST',
          body: JSON.stringify({
            fileHash: this.fileHash,
            filename: this.file.name,
            totalChunks: this.totalChunks
          })
        })
      }

      this.emit('done')
      this._running = false
    } catch (err) {
      this._running = false
      if (err.message === 'Upload aborted') this.emit('cancel')
      else this.emit('error', err)
      throw err
    }
  }

  pause() {
    if (!this._running) return
    this._paused = true
    this.emit('pause')
  }

  resume() {
    if (!this._paused) return
    this._paused = false
    this.emit('resume')
    // 重新调用 start 会重新开始（注意：start 会重新计算并行工作）
    return this.start()
  }

  abort() {
    this._aborted = true
    this._running = false
    this._paused = false
    // Abort all pending requests
    for (const c of this._abortControllers) {
      try {
        c.abort()
      } catch (e) {}
    }
    this._abortControllers.clear()
    // 尝试中止 XHR
    for (const x of this._xhrSet) {
      try {
        x.abort()
      } catch (e) {}
    }
    this._xhrSet.clear()
    this.emit('cancel')
  }

  // ========== 辅助：解析大小字符串 ===========
  static parseSize(size) {
    if (size == null) return NaN
    if (typeof size === 'number' && Number.isFinite(size)) return Math.floor(size)

    const str = String(size).trim().toLowerCase()
    if (!str) return NaN

    const m = str.match(/^(\d+(?:\.\d+)?)(?:\s*(b|kb|k|mb|m|gb|g|tb|t|pb|p))?$/i)
    if (!m) return NaN

    const num = parseFloat(m[1])
    const unit = (m[2] || 'b').toLowerCase()

    const MULT = {
      b: 1,
      k: 1024,
      kb: 1024,
      m: 1024 ** 2,
      mb: 1024 ** 2,
      g: 1024 ** 3,
      gb: 1024 ** 3,
      t: 1024 ** 4,
      tb: 1024 ** 4,
      p: 1024 ** 5,
      pb: 1024 ** 5
    }

    return Math.floor(num * (MULT[unit] || 1))
  }
}

/*
Usage 示例：

import ChunkedUploader from './chunk-uploader.js'

const uploader = new ChunkedUploader({
  file: selectedFile,
  chunkSize: '1MB',
  concurrent: 4,
  retryTimes: 3,
  // 可选：自定义上传函数
  uploadFn: async ({ file, index, totalChunks, fileHash, chunkHash, fileName, signal }) => {
    // 使用 fetch 或其他库上传
    const formData = new FormData()
    formData.append('chunk', file)
    formData.append('chunkIndex', index)
    formData.append('totalChunks', totalChunks)
    formData.append('fileHash', fileHash)
    formData.append('chunkHash', chunkHash)
    formData.append('filename', fileName)

    const resp = await fetch('/api/custom-upload', { method: 'POST', body: formData, signal })
    if (!resp.ok) throw new Error('upload failed')
    return resp.json()
  },
  // 可选：断点续传检查
  getUploadedChunks: async (fileHash) => {
    const r = await fetch('/api/upload/check', { method: 'POST', body: JSON.stringify({ fileHash }), headers: { 'Content-Type': 'application/json' } })
    const j = await r.json()
    return j.uploadedChunks || []
  }
})

uploader.on('progress', p => console.log('整体进度', p))
uploader.on('chunk-progress', c => console.log('分片进度', c))
uploader.on('file-hash', h => console.log('fileHash', h))

// 启动上传（可选传入合并接口）
uploader.start({ mergeUrl: '/api/upload/merge' }).then(()=>console.log('done')).catch(e=>console.error(e))

// 取消
// uploader.abort()
*/
