// 1. js 实现一个字符串匹配算法，从长度为n的字符串S中，查找是否存在字符串T，T的长度是m，若存在返回所在位置
function findSubstring(S, T) {
    if (T === "") return 0; // T 是空字符串时返回 0
    const n = S.length,
        m = T.length;
    if (n < m) return -1; // S 比 T 短，直接返回 -1

    // 遍历所有可能的起始位置
    for (let i = 0; i <= n - m; i++) {
        // 检查从 i 开始的子串是否匹配 T
        if (S.substring(i, i + m) === T) {
            return i; // 找到匹配，返回起始位置
        }
    }
    return -1; // 未找到匹配
}

// 2. 如何把一个字符串的大小写取反（大写变小写小写变大写），例如'AbC’变成‘aBc’。
function swapCase(str) {
    return str
        .split("")
        .map((char) => {
            if (char !== char.toUpperCase()) {
                // 当前字符为小写
                return char.toUpperCase();
            } else if (char !== char.toLowerCase()) {
                // 当前字符为大写
                return char.toLowerCase();
            }
            return char; // 非字母字符保持不变
        })
        .join("");
}
console.log(swapCase("AbC")); // 输出: 'aBc'
console.log(swapCase("Hello123")); // 输出: 'hELLO123'
console.log(swapCase("àçÇ")); // 输出: 'ÀÇç'