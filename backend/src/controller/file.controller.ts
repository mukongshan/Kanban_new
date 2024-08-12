import { Controller, Post, Inject, Files, Fields, Param, Body } from '@midwayjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { Context } from '@midwayjs/koa';
import { MissionService } from '../service/mission.service';
import { InjectEntityModel } from '@midwayjs/typegoose';

@Controller('/files')
export class FileController {

  @InjectEntityModel(MissionService)
  missionModel: MissionService;

  @Inject()
  ctx: Context;

  @Post('/upload/:missionid')
  async upload(@Files() files: any[], @Fields() fields: any, @Param('missionid') missionid: string) {
    try {
      console.log('开始上传...');

      // 定义保存文件的目标目录
      const uploadDir = path.join(__dirname, '../../uploads');

      // 确保目录存在
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      console.log('上传文件:', this.ctx.files);
      if (!files || files.length === 0) {
        throw new Error('No files were uploaded');
      }

      // 处理每个文件
      const savedFiles = files.map(file => {
        const targetPath = path.join(uploadDir, file.filename);

        // 使用 fs.createReadStream 和 fs.createWriteStream 进行文件移动
        const readStream = fs.createReadStream(file.data);
        const writeStream = fs.createWriteStream(targetPath);
        readStream.pipe(writeStream);

        // 返回文件的URL或路径
        return `/uploads/${file.filename}`; // 这个路径可以根据你的实际情况调整
      });

      // 将文件信息存储到Mission的attachments数组中
      await this.missionModel.addFilesToMission(missionid, savedFiles);

      // 返回文件信息和其他表单字段
      return {
        success: true,
        attachments: savedFiles,
        fields,
      };
    } catch (error) {
      return {
        success: false,
        message: 'File upload failed',
        error: error.message,
      };
    }
  }

  // @Post(':missionid')
  // async addMission(@Param('missionid') missionid: string, @Body() filePath: string[]) {
  //   try {
  //     await this.missionModel.addFilesToMission(missionid, filePath);
  //     return {
  //       success: true,
  //       message: 'add file successfully',
  //     };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: error.message
  //     };
  //   }
  // }

  @Post('/:username/:projectid/:listid/:missionid')
  async addMission(@Param('username') username: string, @Param('projectid') projectid: string, @Param('listid') listid: string, @Param('missionid') missionid: string, @Body() filePath: string[]) {
    try {
      await this.missionModel.addFilesToMission(missionid, filePath);
      return {
        success: true,
        message: 'add file successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }


  // @Post('/upload/:missionid')
  // async upload(@Files() files, @Fields() fields) {
  //   /*
  //   files = [
  //     {
  //       filename: 'test.pdf',        // 文件原名
  //       data: '/var/tmp/xxx.pdf',    // mode 为 file 时为服务器临时文件地址
  //       fieldname: 'test1',          // 表单 field 名
  //       mimeType: 'application/pdf', // mime
  //     },
  //     {
  //       filename: 'test.pdf',        // 文件原名
  //       data: ReadStream,    // mode 为 stream 时为服务器临时文件地址
  //       fieldname: 'test2',          // 表单 field 名
  //       mimeType: 'application/pdf', // mime
  //     },
  //     // ...file 下支持同时上传多个文件
  //   ]

  //   */
  //   return {
  //     files,
  //     fields
  //   }
  // }

}