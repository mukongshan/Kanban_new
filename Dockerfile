# 第一阶段：构建后端应用
FROM node:18 AS backend-build

# 设置工作目录
WORKDIR /app

# 复制后端项目的文件
COPY backend/package*.json ./
COPY backend/ ./

# 安装依赖并构建后端应用
RUN npm install
RUN npm run build

# 第二阶段：构建前端应用
FROM node:16 AS frontend-build

# 设置工作目录
WORKDIR /app

# 复制前端项目的文件
COPY frontend/package*.json ./
COPY frontend/ ./

# 安装依赖并构建前端应用
RUN npm install
RUN npm run build

# 第三阶段：创建最终镜像并部署
FROM node:18-alpine AS production

# 设置工作目录
WORKDIR /app

# 复制前端构建好的文件到 Nginx 目录
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# 复制后端构建好的文件到相应目录
COPY --from=backend-build /app/dist ./backend/dist
COPY --from=backend-build /app/src ./backend/src
COPY --from=backend-build /app/bootstrap.js ./backend/
COPY --from=backend-build /app/package.json ./backend/

# 安装 Nginx 和 tzdata，并配置时区
RUN apk add --no-cache nginx tzdata
ENV TZ="Asia/Shanghai"

# 安装后端生产环境依赖
RUN cd backend && npm install --production

# 复制 Nginx 配置文件（需要自行准备 nginx.conf 文件）
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80
EXPOSE 7001

# 启动后端服务和 Nginx
CMD ["sh", "-c", "npm run --prefix backend start & nginx -g 'daemon off;'"]
