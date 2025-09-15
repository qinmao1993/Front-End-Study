// 加密解密
import {
    createCipheriv,
    createDecipheriv,
    randomBytes,
    scryptSync,
    generateKeyPairSync,
    publicEncrypt,
    privateDecrypt,
} from "node:crypto";

/**
 * 对称加密: 在加密和解密时，使用同一个秘钥以及iv
 * @param {String} text 要加密的文本
 * @param {String} password 用于生成秘钥的密码
 * @returns {Object} 加密后的文本信息
 */
function dcEncrypt(text, password) {
    const algorithm = "aes-256-cbc";
    const key = scryptSync(password, "salt", 32);
    // 初始化随机向量 iv 保证每次获取的秘钥串是不一样的，支持16位
    const iv = randomBytes(16);
    // 创建加密算法
    const cipher = createCipheriv(algorithm, key, iv);

    // 加密数据
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex"); // 输出密文 16 位
    return {
        encrypted,
        iv: iv.toString("hex"),
    };
}

/**
 * 对称解密
 * @param {String} text 加密的文本
 * @param {String} iv  初始化向量
 * @param {String} password 用于生成秘钥的密码
 * @returns {String} 解密后的文本
 */
function dcDecrypt(text, iv, password) {
    //  解密数据:保证秘钥、算法和iv是一致的
    const algorithm = "aes-256-cbc";
    const key = scryptSync(password, "salt", 32);
    const encryptIv = Buffer.from(iv, "hex");
    // 创建解密算法
    const decipher = createDecipheriv(algorithm, key, encryptIv);

    // 解密数据
    let decrypted = decipher.update(text, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}

/**
 * 非对称加密
 * @param {*} text
 * @param {*} publicKey 公钥
 * @returns
 */
function fdcEncrypt(text, publicKey) {
    const buffer = Buffer.from(text);
    const encrypted = publicEncrypt(publicKey, buffer);
    return encrypted.toString("hex");
}

/**
 * 非对称解密
 * @param {*} encryptedText
 * @param {*} privateKey
 * @returns
 */
function fdcDecrypt(encryptedText, privateKey) {
    const buffer = Buffer.from(encryptedText, "hex");
    const decrypted = privateDecrypt(privateKey, buffer);
    // const decrypted = privateDecrypt(
    //     {
    //         key: privateKey,
    //         passphrase: "password", // 这里要和生成私钥时一致
    //     },
    //     buffer
    // );
    return decrypted.toString();
}

// const encryptedInfo = dcEncrypt("Hello World", "password");
// console.log("encryptedInfo:", encryptedInfo);
// const decryptedText = dcDecrypt(
//     encryptedInfo.encrypted,
//     encryptedInfo.iv,
//     "password"
// );
// console.log("decryptedText:", decryptedText);

// 生成公钥和私钥
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 4096, // 越长越安全
    publicKeyEncoding: {
        type: "spki",
        format: "pem",
    },
    privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        // cipher: "aes-256-cbc",
        // passphrase: "password", // 私钥的密码,如果设置，解密时需要提供
    },
});

// 明文
const plainText = "Hello, 非对称加密！";
// 加密
const encryptedText = fdcEncrypt(plainText, publicKey);
console.log("加密后的内容:", encryptedText);
// 解密
const decryptedText = fdcDecrypt(encryptedText, privateKey);
console.log("解密后的内容:", decryptedText);
