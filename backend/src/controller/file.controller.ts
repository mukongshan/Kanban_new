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
      console.log('Files:', files);

      const uploadDir = path.join(__dirname, '../../uploads');
      console.log('uploadDir:', uploadDir);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      if (!files || files.length === 0) {
        throw new Error('No files were uploaded');
      }

      const file = files[0];
      console.log('Uploaded file:', file);

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

      // Check if file.data is a path or Buffer
      if (Buffer.isBuffer(file.data)) {
        // If file.data is a Buffer, write it directly
        fs.writeFileSync(targetPath, file.data);
      } else if (typeof file.data === 'string') {
        // If file.data is a path, read the file content from the path
        const fileContent = fs.readFileSync(file.data);
        fs.writeFileSync(targetPath, fileContent);
      } else {
        throw new Error('Invalid file data');
      }

      const savedFilePath = `http://localhost:7001/uploads/${file.filename}`;
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

      this.ctx.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
      this.ctx.set('Content-Type', 'application/octet-stream');

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
