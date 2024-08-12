# 使用官方的 Node.js 作为基础镜像
FROM node:18 AS build
# 设置工作目录
WORKDIR /app
# 复制项目文件到工作目录
COPY . .
# # 复制 package.json 和 package-lock.json 到容器
# COPY package*.json ./

# 安装依赖
RUN npm install
RUN npm run build
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/bootstrap.js ./
COPY --from=build /app/package.json ./

RUN apk add --no-cache tzdata
ENV TZ="Asia/Shanghai"
RUN npm install --production

# 暴露应用的端口（比如你的应用运行在 3000 端口上）
EXPOSE 5173

# 启动应用
CMD ["npm", "run", "start"]
