import { Controller, Post, Param, Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { MissionService } from '../service/mission.service';


@Controller('/file')
export class TaskController {
  @Inject()
  ctx: Context;

  @Inject()
  missionService: MissionService;

  @Post('/:missionid')
  async uploadFile(@Param('missionid') missionid: string) {
    const file = this.ctx.request.files.file;  // 获取上传的文件
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
