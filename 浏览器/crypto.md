# crypto
浏览器中的 Crypto API 是一组用于执行基本加密操作的 Web API，包括随机数生成、哈希计算、数字签名等功能。
它提供了在客户端进行密码学操作的能力，而无需依赖服务器

## crypto.getRandomValues()
  - 生成加密安全的随机数，用于生成密钥、盐值等。
  ```js
    // 生成随机字节数组
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    console.log(array); // 16个随机字节

    // 生成随机数用于各种用途
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    const randomNumber = randomBuffer[0] / (0xffffffff + 1);
  ```

## crypto.subtle
提供更高级的加密功能，包括哈希、加密、解密、签名等。所有方法都返回 Promise
* 支持的算法类型
  - 哈希	SHA-1, SHA-256, SHA-384, SHA-512
  - HMAC	各种哈希算法
  - 非对称加密	RSA-OAEP, RSA-PSS, ECDSA, ECDH
  - 对称加密	AES-CBC, AES-CTR, AES-GCM, AES-KW

* 哈希计算
  ```js
    // 计算字符串的 SHA-256 哈希
    async function hashString(message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        
        const hash = await crypto.subtle.digest('SHA-256', data);
        
        // 将 ArrayBuffer 转换为十六进制字符串
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return hashHex;
    }

    // 使用示例
    hashString('Hello, World!').then(hash => {
        console.log('SHA-256:', hash);
    });
  ```

* HMAC 签名
  ```js
    async function generateHMAC(key, message) {
        const encoder = new TextEncoder();
        
        // 导入密钥
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            encoder.encode(key),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign', 'verify']
        );
        
        // 签名
        const signature = await crypto.subtle.sign(
            'HMAC',
            cryptoKey,
            encoder.encode(message)
        );
        
        return Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // 使用示例
    generateHMAC('secret-key', 'message to sign')
        .then(signature => console.log('HMAC:', signature));
  ```

* AES 加密/解密
  ```js
    class AESCrypto {
        // 生成密钥
        static async generateKey() {
            return await crypto.subtle.generateKey(
                {
                    name: 'AES-GCM',
                    length: 256,
                },
                true,
                ['encrypt', 'decrypt']
            );
        }
        
        // 导出密钥（用于存储）
        static async exportKey(key) {
            const exported = await crypto.subtle.exportKey('jwk', key);
            return JSON.stringify(exported);
        }
        
        // 导入密钥
        static async importKey(jwkString) {
            const jwk = JSON.parse(jwkString);
            return await crypto.subtle.importKey(
                'jwk',
                jwk,
                { name: 'AES-GCM' },
                true,
                ['encrypt', 'decrypt']
            );
        }
        
        // 加密
        static async encrypt(key, data) {
            const encoder = new TextEncoder();
            const iv = crypto.getRandomValues(new Uint8Array(12));
            
            const encrypted = await crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                encoder.encode(data)
            );
            
            return {
                iv: Array.from(iv),
                data: Array.from(new Uint8Array(encrypted))
            };
        }
        
        // 解密
        static async decrypt(key, encryptedData) {
            const decoder = new TextDecoder();
            
            const decrypted = await crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: new Uint8Array(encryptedData.iv)
                },
                key,
                new Uint8Array(encryptedData.data)
            );
            
            return decoder.decode(decrypted);
        }
    }

    // 使用示例
    async function demoAES() {
        const key = await AESCrypto.generateKey();
        const keyString = await AESCrypto.exportKey(key);
        console.log('密钥:', keyString);
        
        const originalText = '秘密信息';
        const encrypted = await AESCrypto.encrypt(key, originalText);
        console.log('加密数据:', encrypted);
        
        const importedKey = await AESCrypto.importKey(keyString);
        const decrypted = await AESCrypto.decrypt(importedKey, encrypted);
        console.log('解密结果:', decrypted);
    }
  ```
  
* RSA 非对称加密
  ```js
    class RSACrypto {
        // 生成密钥对
        static async generateKeyPair() {
            return await crypto.subtle.generateKey(
                {
                    name: 'RSA-OAEP',
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: 'SHA-256'
                },
                true,
                ['encrypt', 'decrypt']
            );
        }
        
        // 使用公钥加密
        static async encrypt(publicKey, data) {
            const encoder = new TextEncoder();
            return await crypto.subtle.encrypt(
                { name: 'RSA-OAEP' },
                publicKey,
                encoder.encode(data)
            );
        }
        
        // 使用私钥解密
        static async decrypt(privateKey, encryptedData) {
            const decoder = new TextDecoder();
            const decrypted = await crypto.subtle.decrypt(
                { name: 'RSA-OAEP' },
                privateKey,
                encryptedData
            );
            return decoder.decode(decrypted);
        }
    }

    // 使用示例
    async function demoRSA() {
        const keyPair = await RSACrypto.generateKeyPair();
        
        const message = '使用RSA加密的消息';
        const encrypted = await RSACrypto.encrypt(keyPair.publicKey, message);
        console.log('RSA加密数据:', new Uint8Array(encrypted));
        
        const decrypted = await RSACrypto.decrypt(keyPair.privateKey, encrypted);
        console.log('RSA解密结果:', decrypted);
    }
  ```

## 浏览器兼容性
* crypto.getRandomValues(): 广泛支持
* crypto.subtle: 现代浏览器支持良好

## 注意事项
* 安全上下文要求: Crypto.subtle 仅在安全上下文（HTTPS 或 localhost）中可用
* 性能考虑: 复杂的加密操作可能影响性能，特别是在移动设备上
* 密钥管理: 妥善管理密钥，避免在客户端存储敏感密钥
* 错误处理: 始终添加适当的错误处理

## 工具函数
  ```js
    /**
     * ArrayBuffer转Base64
     * @param {ArrayBuffer} buffer
     * @returns {string}
     */
    export function arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer)
        let binary = ''
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return btoa(binary)
    }

    /**
     * Base64转ArrayBuffer
     * @param {string} base64
     * @returns {ArrayBuffer}
     */
    export function base64ToArrayBuffer(base64) {
        const binaryString = atob(base64)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }
        return bytes.buffer
    }

    /**
     * Uint8Array转十六进制字符串
     * @param {Uint8Array} uint8Array
     * @returns {string}
     */
    export function uint8ArrayToHex(uint8Array) {
        return Array.from(uint8Array)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
    }

    /**
     * 十六进制字符串转Uint8Array
     * @param {string} hexString
     * @returns {Uint8Array}
     */
    export function hexToUint8Array(hexString) {
        const result = new Uint8Array(hexString.length / 2)
        for (let i = 0; i < hexString.length; i += 2) {
            result[i / 2] = parseInt(hexString.substring(i, i + 2), 16)
        }
        return result
    }
  ```