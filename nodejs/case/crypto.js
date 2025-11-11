// 加密解密
import {
    createCipheriv,
    createDecipheriv,
    randomBytes,
    scryptSync,
    generateKeyPairSync,
    publicEncrypt,
    privateDecrypt,
    createPublicKey,
    createPrivateKey,
    publicDecrypt,
    privateEncrypt,
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
 * 非对称-公钥加密
 * @param {*} text 要加密内容
 * @param {*} publicKey 公钥
 * @returns
 */
function fdcPublicEncrypt(text, publicKey) {
    const buffer = Buffer.from(text);
    const encrypted = publicEncrypt(publicKey, buffer);
    // return encrypted.toString("hex");
    return encrypted.toString("base64");
}

/**
 * 非对称-私钥解密
 * @param {*} encryptedText
 * @param {*} privateKey
 * @returns
 */
function fdcPrivateDecrypt(encryptedText, privateKey) {
    // const buffer = Buffer.from(encryptedText, "hex");
    const buffer = Buffer.from(encryptedText, "base64");
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
// const { privateKey, publicKey } = generateKeyPairSync("rsa", {
//     modulusLength: 4096, // 越长越安全
//     publicKeyEncoding: {
//         type: "spki",
//         format: "pem",
//     },
//     privateKeyEncoding: {
//         type: "pkcs8",
//         format: "pem",
//         // cipher: "aes-256-cbc",
//         // passphrase: "password", // 私钥的密码,如果设置，解密时需要提供
//     },
// });

// 公钥和私钥
const publicKeyBase64 = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCjk5Av7vgojaGBFhOdGWuAtLUCD0WGI6XHtWi0VrFHyr79AD4x9Jo4zI1lHzORr/Nq+uX1Ma8tyYvgjl/9TC3OJDY1dB7D8fzAXXAUoFWc4zheHPIjgcnibNjxgWG2YcpKZGNJHUnIctVQwLMxA7SUwNA8I6YTeF7cFq8uOByp3QIDAQAB`;
const keyBytes = Buffer.from(publicKeyBase64, "base64");
const publicKey = createPublicKey({
    key: keyBytes,
    format: "der",
    type: "spki",
});

const privateKeyBase64 = `MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKOTkC/u+CiNoYEWE50Za4C0tQIPRYYjpce1aLRWsUfKvv0APjH0mjjMjWUfM5Gv82r65fUxry3Ji+COX/1MLc4kNjV0HsPx/MBdcBSgVZzjOF4c8iOByeJs2PGBYbZhykpkY0kdSchy1VDAszEDtJTA0DwjphN4XtwWry44HKndAgMBAAECgYAXzSDt2JfDTthxMAUqlshNsf2kjxROsGEu7faORw8EozunFKH4It9N5HWugRu/1xpUNq2/P7t9rhXsVssg0DTZzii8VcDKZZ6SyS3t9S/VMOsZ3Kad9ae8NmGBuHduwNFq/iIvnvSXHCxPWE0BcqJqxGSi0JtlTeX13qsYCxBYAQJBAN5t239v6IzW2NyHzswAZVcUhvehX+GMCpbeexCBnIQe+OzkPXLSxKB/TguA302uZIXiNQKfgYvcC11+Qh6INfkCQQC8Q8Y869ilVjcwIu1DNgMf4/sEqIhzauTFt6sBYaAWXNOgYJv1FxEd12tjrwz+8MgZ3zr2HuUA03dBwX5nh3wFAkBBCAuJ2dU7AEHNUGOU33TBnf3L/sGCtygNbiS68boqIsgSsrSIkrjsV+wgjuA63QcE4dsv1iTRGFe2UQjR1m85AkARopugO0t4+WGEDdGB2T5jr1xlLFBT13CEoNbQ808mqR1dyY7yX23ICNTTaqNiAjYMTl/cjDpRYH2sWC66DfPtAkEAlSFJ/RXXW/RzsEu7HtTJc5X0qV48sl5Khi+aTXliyPsm3FmFRrddeAovMBwBQxstSyGbWkSawumlqjoNJ9WDrA==`;
const privateKeyBytes = Buffer.from(privateKeyBase64, "base64");
const privateKey = createPrivateKey({
    key: privateKeyBytes,
    format: "der",
    type: "pkcs8",
});

// 公钥加密 -> 私钥解密
// const plainText = 'hello,world'
// const encryptedText1 = fdcPublicEncrypt(plainText, publicKey);
// console.log("公钥加密后的内容: ", encryptedText1);

// const decryptedText1 = fdcPrivateDecrypt(encryptedText1, privateKey);
// console.log("私钥解密后的内容: ", decryptedText1);
