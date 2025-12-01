#!/usr/bin/env bash
# VSCode Remote 离线部署脚本（改进版）
# 说明：
#  - 默认从本地 code --version 获取 commit id，也可通过 -c 指定
#  - 将 server 与 cli 上传并在远端按 VSCode Remote 期望的位置解压部署
#  - 支持自动检测 wget/curl、自动检测 arch、可选择只打包不上传
# 使用：./install.sh -t user@host [-c COMMIT] [-a linux-x64] [--no-upload] [--help]

# vscode v1.79+ 远程开发离线安装

set -euo pipefail

PROG="$(basename "$0")"
TMPDIR="${TMPDIR:-/tmp}"
DOWNLOAD_DIR="$PWD"
NO_UPLOAD=0

log() { printf '%s\n' "$*"; }
err() { printf 'ERROR: %s\n' "$*" >&2; }
usage() {
    cat <<EOF
$PROG - VSCode Remote 离线安装脚本

必选:
  -t <user@host>    远程主机（ssh 可达）

可选:
  -c <commit-id>    使用指定的 Commit ID（默认从本地 code --version 获取）
  -a <arch>         打包架构，默认 auto (linux-x64 / linux-arm64)
  --no-upload       只在本地下载打包文件，不上传或在远端执行部署
  -h|--help         显示此帮助

示例:
  $PROG -t user@1.2.3.4
  $PROG -t user@host -c 1234567890abcdef -a linux-x64 --no-upload
EOF
}

# 解析参数
TARGET_HOST=""
COMMIT_ID=""
ARCH="auto"
while [[ $# -gt 0 ]]; do
    case "$1" in
    -t)
        TARGET_HOST="$2"
        shift 2
        ;;
    -c)
        COMMIT_ID="$2"
        shift 2
        ;;
    -a)
        ARCH="$2"
        shift 2
        ;;
    --no-upload)
        NO_UPLOAD=1
        shift
        ;;
    -h | --help)
        usage
        exit 0
        ;;
    *)
        err "未知参数: $1"
        usage
        exit 2
        ;;
    esac
done

if [[ -z "$TARGET_HOST" ]]; then
    err "必须指定目标主机 -t user@host"
    usage
    exit 2
fi

# 检查本地 code
if ! command -v code >/dev/null 2>&1; then
    err "本地未找到 'code' 可执行文件，请在本地安装 VSCode 并确保命令行工具已启用"
    exit 3
fi

# 获取 COMMIT_ID
if [[ -z "$COMMIT_ID" || "$COMMIT_ID" == "auto" ]]; then
    COMMIT_ID="$(code --version 2>/dev/null | sed -n '2p' || true)"
    if [[ -z "$COMMIT_ID" ]]; then
        err "无法从本地 code --version 获取 Commit ID，请手动使用 -c 指定"
        exit 4
    fi
fi

# 判定架构
if [[ "$ARCH" == "auto" ]]; then
    UNAME_M="$(uname -m)"
    case "$UNAME_M" in
    x86_64 | amd64) ARCH="linux-x64" ;;
    aarch64 | arm64) ARCH="linux-arm64" ;;
    *)
        ARCH="linux-x64"
        log "未识别本机架构($UNAME_M)，默认使用 linux-x64"
        ;;
    esac
fi

log "Commit ID: $COMMIT_ID"
log "Target: $TARGET_HOST"
log "Arch: $ARCH"
log "下载目录: $DOWNLOAD_DIR"

# 下载函数，优先 wget 再 curl
download() {
    local url="$1" out="$2"
    if command -v wget >/dev/null 2>&1; then
        wget -c -O "$out" "$url"
    elif command -v curl >/dev/null 2>&1; then
        curl -L --fail -C - -o "$out" "$url"
    else
        err "未安装 wget 或 curl，无法下载 $url"
        return 1
    fi
}

SERVER_NAME="vscode-server-${ARCH}.tar.gz"
CLI_NAME="vscode-cli-alpine-x64.tar.gz"
SERVER_URL="https://update.code.visualstudio.com/commit:${COMMIT_ID}/server-${ARCH}/stable"
CLI_URL="https://update.code.visualstudio.com/commit:${COMMIT_ID}/cli-alpine-x64/stable"

# log "步骤1: 下载 Server & CLI 包..."
# download "$SERVER_URL" "$DOWNLOAD_DIR/$SERVER_NAME"
# download "$CLI_URL" "$DOWNLOAD_DIR/$CLI_NAME"
# log "下载完成: $SERVER_NAME, $CLI_NAME"

if [[ $NO_UPLOAD -eq 1 ]]; then
    log "--no-upload 指定，下载完成后退出（未上传）"
    exit 0
fi

# 检查 scp / ssh 可用
if ! command -v scp >/dev/null 2>&1 || ! command -v ssh >/dev/null 2>&1; then
    err "本机缺少 scp 或 ssh 命令，无法上传到远端"
    exit 5
fi

# 上传到远端 /tmp
log "步骤2: 上传到远端 /tmp ..."
scp "$DOWNLOAD_DIR/$SERVER_NAME" "$DOWNLOAD_DIR/$CLI_NAME" "$TARGET_HOST:/tmp/" || {
    err "上传失败，请检查网络与 ssh 登录"
    exit 6
}

# 远端部署：解压并移动到 ~/.vscode-server 的期望位置
REMOTE_CMD=$(
    cat <<'REMOTE_EOF'
    set -euo pipefail
    COMMIT_ID="$1"
    ARCH="$2"

    # 目标目录
    mkdir -p ~/.vscode-server/cli/servers/Stable-"$COMMIT_ID"
    mkdir -p ~/.vscode-server

    cd /tmp

    # 解压 server 包到临时目录，然后移动为 server 目录（确保与 VSCode 期望的结构一致）
    if [ -f "vscode-server-${ARCH}.tar.gz" ]; then
    tar -xzf "vscode-server-${ARCH}.tar.gz"
    else
    # 兼容不同文件名
    tar -xzf vscode-server-*.tar.gz
    fi

    # 尝试识别解压出的目录名
    SRV_DIR="$(tar -tzf "vscode-server-${ARCH}.tar.gz" | head -1 | cut -d/ -f1 2>/dev/null || true)"
    if [ -n "$SRV_DIR" ] && [ -d "$SRV_DIR" ]; then
    rm -rf ~/.vscode-server/cli/servers/Stable-"$COMMIT_ID"/server
    mv "$SRV_DIR" ~/.vscode-server/cli/servers/Stable-"$COMMIT_ID"/server
    else
    # 如果不确定目录结构，直接将内容解到 server 目录下
    rm -rf ~/.vscode-server/cli/servers/Stable-"$COMMIT_ID"/server
    mkdir -p ~/.vscode-server/cli/servers/Stable-"$COMMIT_ID"/server
    tar -xzf "vscode-server-${ARCH}.tar.gz" -C ~/.vscode-server/cli/servers/Stable-"$COMMIT_ID"/server --strip-components=1
    fi

    # 解压 CLI（alpine）并将 code 重命名为 code-COMMIT 放到 ~/.vscode-server/
    if [ -f "vscode-cli-alpine-x64.tar.gz" ]; then
    tar -xzf vscode-cli-alpine-x64.tar.gz
    elif ls vscode-cli-*.tar.gz >/dev/null 2>&1; then
    tar -xzf vscode-cli-*.tar.gz
    fi

    if [ -f code ]; then
    mv -f code ~/.vscode-server/code-"$COMMIT_ID"
    chmod +x ~/.vscode-server/code-"$COMMIT_ID"
    fi

    # 清理临时包（可选）
    rm -f /tmp/vscode-server-*.tar.gz /tmp/vscode-cli-*.tar.gz

    echo "远端部署完成: Stable-$COMMIT_ID"
REMOTE_EOF
)

log "步骤3: 在远端执行部署脚本..."
ssh "$TARGET_HOST" bash -s -- "$COMMIT_ID" "$ARCH" <<SSH_EOF
$REMOTE_CMD
SSH_EOF

log "=== 部署完成 ==="
log "现在可以通过 VSCode Remote-SSH 连接到 ${TARGET_HOST}"
