const { spawn } = require('child_process');

function runLongTask() {
  return new Promise((resolve, reject) => {
    const child = spawn('node', ['long-running-task.js']);
    let result = '';
    let error = '';

    child.stdout.on('data', (data) => {
      result += data.toString();
    });

    child.stderr.on('data', (data) => {
      error += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(result);
      } else {
        reject(new Error(`任务失败: ${error}`));
      }
    });
  });
}

// 使用async/await调用
async function main() {
  try {
    const result = await runLongTask();
    console.log('任务完成:', result);
  } catch (error) {
    console.error('出错:', error.message);
  }
}

main();