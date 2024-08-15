import { MidwayConfig } from '@midwayjs/core';
import { User } from '../entity/user';
// import { uploadWhiteList } from '@midwayjs/upload';
import { tmpdir } from 'os';
import { join } from 'path';
import Project from '../entity/project';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1721920175642_2032',
  koa: {
    port: 7001,
  },
  mongoose: {
    dataSource: {
      default: {
        uri: 'mongodb://kanban-mongo:27017/userDataBase',
        entities: [User]
      },
      projectDB: {
        uri: 'mongodb://kanban-mongo:27017/projectDataBase',
        entities: [Project], // 配置另一数据库的实体
      },
    }
  },
  upload: {
    // mode: UploadMode, 默认为file，即上传到服务器临时目录，可以配置为 stream
    mode: 'file',
    // fileSize: string, 最大上传文件大小，默认为 10mb
    fileSize: '10mb',
    // whitelist: string[]，文件扩展名白名单
    whitelist: ['.txt', '.jpg', '.png', '.gif', '.jpeg', '.pdf', '.docx', '.xlsx', '.ppt', '.pptx', '.zip', '.rar', '.7z', '.tar'],
    // tmpdir: string，上传的文件临时存储路径
    tmpdir: join(tmpdir(), 'midway-upload-files'),
    // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟
    cleanTimeout: 5 * 60 * 1000,
    // base64: boolean，设置原始body是否是base64格式，默认为false，一般用于腾讯云的兼容
    base64: false,
    // 仅在匹配路径到 /api/upload 的时候去解析 body 中的文件信息
    match: /\/files\/upload\/*/,
  },
} as MidwayConfig;
