# ==================== 构建阶段 ====================
FROM node:24.18.0-bookworm-slim AS build

# 容器默认时区为UTC 设置容器上海时间
ENV TZ=Asia/Shanghai \
    DEBIAN_FRONTEND=noninteractive
RUN ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime && echo ${TZ} > /etc/timezone && dpkg-reconfigure --frontend noninteractive tzdata && rm -rf /var/lib/apt/lists/*

#  指定工作目录
WORKDIR /usr/src/app

# 拷贝包管理文件到/usr/src/app 根目录下
COPY package*.json  ./ 

# 配置源 + 安装所有依赖（包括 devDependencies，因为构建需要 tsc/nest cli）
# 增加缓存清理，减小镜像体积
RUN npm config set registry https://registry.npmmirror.com \
    && npm install \
    && npm cache clean --force

# 将拷贝源码并构建，忽略 .dockerignore 文件中指定的文件
COPY . ./
RUN npm run build 


# ==================== 生产阶段 ====================
FROM node:24.18.0-bookworm-slim  AS deploy
    
# 设置环境变量
ENV NODE_ENV=production \
    RUNNING_ENV=prod \
    TZ=Asia/Shanghai \
    DEBIAN_FRONTEND=noninteractive

# 设置时区
RUN ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime && echo ${TZ} > /etc/timezone && dpkg-reconfigure --frontend noninteractive tzdata && rm -rf /var/lib/apt/lists/*

#  指定工作目录
WORKDIR /usr/src/app

# 拷贝包管理文件到/usr/src/app 根目录下
COPY package*.json  ./

# 只安装生产依赖（--omit=dev），并利用 npm ci 加速（依赖 lock 文件）
# 同样清理缓存，并利用 --no-audit --no-fund 跳过非必要检查
RUN npm config set registry https://registry.npmmirror.com \
    && npm ci --omit=dev --no-audit --no-fund \
    && npm cache clean --force

# 拷贝需要的文件
COPY --from=build /usr/src/app/dist ./dist 
COPY --from=build  /usr/src/app/config ./config
COPY --from=build /usr/src/app/public ./ 

EXPOSE 3001

# 执行启动命令
# 直接使用 node 启动，抛弃 npm run 包装器
CMD ["node", "dist/main.js"]