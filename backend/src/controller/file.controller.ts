import { Controller, Post, Param, Inject } from '@midwayjs/decorator';

import { Context } from '@midwayjs/koa';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { MissionService } from '../service/mission.service';


@Controller('/files')
export class FileController {
  @Inject()
  ctx: Context;

  @Inject()
  missionService: MissionService;

  @Post('/:missionid')
  async uploadFile(@Param('missionid') missionid: string) {
    console.log(this.ctx.request.files)
    console.log('开始上传...');
    const file = this.ctx.request.files.file;  // 获取上传的文件
    if (!validFilename(file.name)) {
      throw new Error('Invalid upload file name');
    }
    console.log(`上传的文件名: ${file.name}`);
    const uniqueFileName = `${uuidv4()}-${file.name}`;  // 生成唯一文件名
    const uploadPath = `/uploads/${uniqueFileName}`;    // 文件保存路径

    // 将文件保存到服务器的 /uploads 目录
    await fs.rename(file.path, `./public${uploadPath}`);

    // 将文件路径保存到任务的附件列表中
    await this.missionService.addAttachment(missionid, uploadPath);

    // 返回文件路径给前端
    this.ctx.body = { filePath: uploadPath };
  }

}



function validFilename(filename: string): boolean {
  const validPattern = /^[a-zA-Z0-9._-]+$/;
  return validPattern.test(filename);
}
