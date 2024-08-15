# Kan_ban 使用说明

# 获取 docker 镜像

库的链接是： mukongshan/kan_ban_new:latest

1. docker pull mukongshan/kan_ban_new:latest
2. docker run -d --name kanban-mongo --network kanban-network -p 27017:27017 mongo:latest
3. docker run -d -p 80:80 -p 7001:7001 --name kanban-container --network kanban-network mukongshan/kan_ban_new:latest
4. 进入网页 127.0.0.1:80

# 技术栈说明

使用了 mongoDB 库。在成品中使用了双库：userDataBase, projectDataBase。

# 其他说明

## 额外完成

1. 注册功能：没有注册的用户无法登陆。用户可以注册一个账号，账号内容能被保存，即第二次登录同一账号时可以看到上次操作的结果。
2. 共享项目：点开项目设置，会有一个可共享的 id，把它发给团队成员，可以一起完成项目。
3. 项目编辑：可以对项目进行退出，重命名操作。
4. 文件下载：可以下载上传的附件。

## github

1. github 上的链接：git@github.com:mukongshan/Kanban_new.git

## 南大网盘

1. https://box.nju.edu.cn/d/aead1701f2dd461399df/
