import fs, {
    mkdir,
    mkdirSync,
    rmSync,
    rename,
    renameSync,
    readdirSync,
    readFile,
    readFileSync,
    createReadStream,
    existsSync,
    writeFile,
    writeFileSync,
    appendFile,
    appendFileSync,
    createWriteStream,
    unlink,
    unlinkSync  
} from "node:fs";

// FS 模块提供了三种操作模式：
// 同步操作：方法名以 Sync 结尾，会阻塞事件循环
// 异步回调：传统回调方式，最后一个参数是回调函数
// 异步 Promise：通过 fs.promises API 提供

// 1. 文件读取
// 异步回调方式
readFile("example.txt", "utf8", (err, data) => {
    if (err) {
        console.error("读取文件出错:", err);
        return;
    }
    console.log("文件内容:", data);
});

// Promise 方式
async function readFileExample() {
    try {
        const data = await fs.promises.readFile("example.txt", "utf8");
        console.log("文件内容:", data);
    } catch (err) {
        console.error("读取文件出错:", err);
    }
}

// 同步读取文件
try {
    const data = readFileSync("example.txt", "utf8");
    console.log("文件内容:", data);
} catch (err) {
    console.error("读取文件出错:", err);
}

// 流式读取（适合大文件）
const readStream = createReadStream("largefile.txt", "utf8");
readStream.on("data", (chunk) => {
    console.log("接收到数据块:", chunk.length);
});
readStream.on("end", () => {
    console.log("文件读取完成");
});
readStream.on("error", (err) => {
    console.error("读取错误:", err);
});

// 2. 文件写入
// 异步写入文件
writeFile("example.txt", "Hello World", "utf8", (err) => {
    if (err) {
        console.error("写入文件出错:", err);
        return;
    }
    console.log("文件写入成功");
});

// Promise 方式
async function writeFileExample() {
    try {
        await fs.promises.writeFile("example.txt", "Hello World", "utf8");
        console.log("文件写入成功");
    } catch (err) {
        console.error("写入文件出错:", err);
    }
}

// 同步写入文件
try {
    writeFileSync("example.txt", "Hello World", "utf8");
    console.log("文件写入成功");
} catch (err) {
    console.error("写入文件出错:", err);
}

// 追加内容到文件
appendFile("example.txt", "\n追加的内容", "utf8", (err) => {
    if (err) console.error(err);
    else console.log("内容追加成功");
});

// 流式写入（适合大文件）
const writeStream = createWriteStream("largefile.txt", "utf8");

writeStream.write("第一行内容\n");
writeStream.write("第二行内容\n");
writeStream.end("最后一行内容");

writeStream.on("finish", () => {
    console.log("所有数据已写入");
});
writeStream.on("error", (err) => {
    console.error("写入错误:", err);
});

// 3. 文件信息与状态
// 获取文件信息
const stats = fs.statSync("example.txt");
console.log("是否是文件:", stats.isFile());
console.log("是否是目录:", stats.isDirectory());
console.log("文件大小:", stats.size);
console.log("文件创建时间:", stats.birthtime);
console.log("文件修改时间:", stats.mtime);

// 检查文件/目录是否存在
if (existsSync("example.txt")) {
    console.log("文件存在");
} else {
    console.log("文件不存在");
}

// 检查读写权限
fs.access("example.txt", fs.constants.R_OK | fs.constants.W_OK, (err) => {
    if (err) {
        console.log("文件不可读写");
    } else {
        console.log("文件可读写");
    }
});

// 4. 目录操作
// 创建目录
// mkdirSync("./test");
// 创建多级目录
mkdirSync("path/to/new/directory", { recursive: true });
// 读取目录内容
const files = readdirSync("path/to/new/directory");
for (const file of files) {
    console.log(file.name, file.isDirectory() ? "(目录)" : "(文件)");
}

// 删除目录（递归删除）
rmSync("./test", { recursive: true });
renameSync('./test','./test-new')

// 删除文件
unlink('file-to-delete.txt', (err) => {
  if (err) console.error(err);
  else console.log('文件删除成功');
});


// 案例：读取文件夹下的所有文件，并批量修改文件名
const testPath = `/Users/qinmao/Desktop/攻克视频技术`;
const paths = readdirSync(testPath);
// console.log("paths:", paths);
const extName = "pdf";
const splitStr = `[防断更微coc3678].${extName}`;

for (let index = 0; index < paths.length; index++) {
    const path = paths[index];
    const nameList = path.split(splitStr);
    if (nameList.length > 1) {
        const name = nameList[0];
        const oldfileName = `${testPath}/${name}${splitStr}`;
        const newFileName = `${testPath}/${name}.${extName}`;
        rename(oldfileName, newFileName, (err) => {
            if (err) throw err;
            console.log("Rename complete!");
        });
    }
}

