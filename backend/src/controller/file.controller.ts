import { Controller, Post, Inject, Files, Fields, Param, Get } from '@midwayjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { Context } from '@midwayjs/koa';
import { MissionService } from '../service/mission.service';

@Controller('/files')
export class FileController {

  @Inject()
  missionService: MissionService;

  @Inject()
  ctx: Context;

  @Post('/upload/:projectid/:listid/:missionid')
  async upload(@Files() files: any[], @Fields() fields: any, @Param('projectid') projectid: string, @Param('listid') listid: string, @Param('missionid') missionid: string) {
    try {
      console.log('开始上传...');

      const uploadDir = path.join(__dirname, '../../uploads'); // 更改路径
      console.log('uploadDir:', uploadDir);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      if (!files || files.length === 0) {
        throw new Error('No files were uploaded');
      }

      const file = files[0]; // 因为只上传一个文件，所以只处理第一个文件

      console.log('开始检查上传的文件...');
      const fileNamePattern = /^[\u4e00-\u9fa5a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/;
      if (!fileNamePattern.test(file.filename)) {
        console.log('文件名不符合规范');
        return {
          success: false,
          message: '文件名不符合规范',
        };
      }

      const targetPath = path.join(uploadDir, file.filename);

      // 使用 fs.writeFileSync 写入文件数据
      fs.writeFileSync(targetPath, file.data);

      const savedFilePath = `http://localhost:7001/uploads/${file.filename}`;

      // 将文件路径存储到Mission的attachments字段中
      console.log('上传成功:', savedFilePath);
      await this.missionService.addAttachmentToMission(projectid, listid, missionid, savedFilePath);

      return {
        success: true,
        attachment: savedFilePath,
        fields,
      };
    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        message: 'File upload failed',
        error: error.message,
      };
    }
  }

  @Get('/download/:filename')
  async download(@Param('filename') filename: string) {
    try {
      const filePath = path.join(__dirname, '../../uploads', filename);

      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          message: 'File not found',
        };
      }

      // 设置响应头以触发文件下载
      this.ctx.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
      this.ctx.set('Content-Type', 'application/octet-stream');

      // 读取文件并发送到客户端
      const stream = fs.createReadStream(filePath);
      this.ctx.body = stream;

    } catch (error) {
      console.error('File download error:', error);
      return {
        success: false,
        message: 'File download failed',
        error: error.message,
      };
    }
  }
}
