# ==================== 构建阶段 ====================
FROM node:24.18.0-bookworm-slim AS builder

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
# 使用一个轻量级的 Nginx Alpine 镜像
FROM nginx:1.26-alpine

# 删除 Nginx 默认的静态文件，保持干净
RUN rm -rf /usr/share/nginx/html/*

# 从第一阶段复制构建产物到 Nginx 的静态资源目录
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# 启动 Nginx (前台运行)
CMD ["nginx", "-g", "daemon off;"]