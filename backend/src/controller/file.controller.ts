import { Controller, Post, Inject, Files, Fields, Param } from '@midwayjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { Context } from '@midwayjs/koa';
import { MissionService } from '../service/mission.service';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

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

      const uploadDir = path.join(__dirname, '../../uploads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      if (!files || files.length === 0) {
        throw new Error('No files were uploaded');
      }

      const file = files[0]; // 因为只上传一个文件，所以只处理第一个文件
      const targetPath = path.join(uploadDir, file.filename);

      const readStream = fs.createReadStream(file.data);
      const writeStream = fs.createWriteStream(targetPath);
      await pipelineAsync(readStream, writeStream);

      const savedFilePath = `../../uploads/${file.filename}`;

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
        error: 'An error occurred during file upload',
      };
    }
  }
}
