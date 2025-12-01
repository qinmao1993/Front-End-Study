#!/usr/bin/env bash

# vscode v1.79+ 远程开发离线安装
# 获取 commit id
COMMIT_ID="$(code --version | sed -n '2p' || true)"
TARGET_HOST="user@remote-ip"  # 修改为你的远程主机
ARCH="linux-x64"  # 根据目标机器架构修改

echo "检测到 Commit ID: $COMMIT_ID"

# 1. 本地下载 Server & CLI 包
echo "步骤1: 下载 Server & CLI..."
DOWNLOAD_URL="https://update.code.visualstudio.com/commit:$COMMIT_ID/server-$ARCH/stable"
# 下载并命名成 vscode-server-$ARCH.tar.gz
wget -O vscode-server-$ARCH.tar.gz "$DOWNLOAD_URL"

wget -O vscode-cli-alpine-x64.tar.gz \
"https://update.code.visualstudio.com/commit:${COMMIT_ID}/cli-alpine-x64/stable" 

# 传输到远程主机(如果可以连接到远程主机，否则手动拷贝到目标机器 /tmp 目录下)
# echo "步骤2: 传输到远程主机..."
# scp vscode-server-$ARCH.tar.gz vscode-cli-alpine-x64.tar.gz  $TARGET_HOST:/tmp/

ssh $TARGET_HOST
# 将 vscode-server-linux-x64.tar.gz 解压解包后名为 vscode-server-linux-x64 文件夹改名为 server 放在 /home/${user}/.vscode-server/cli/servers/Stable-${COMMIT_ID}/
# 将 vscode_cli_alpine_x64_cli.tar.gz 解压解包后名为 code 的文件改名为 code-${COMMIT_ID} 放在 /home/${user}/.vscode-server/目录下

echo "=== 部署完成 ==="
echo "现在可以通过 VSCode Remote-SSH 连接到 $TARGET_HOST"