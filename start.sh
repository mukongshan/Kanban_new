#!/bin/sh

# 启动后端服务
npm start --prefix /app/backend &

# 启动 Nginx
nginx -g "daemon off;"
