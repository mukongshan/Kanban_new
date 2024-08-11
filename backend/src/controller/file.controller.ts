import { Controller, Post, Param, Inject, Files, Fields } from '@midwayjs/core';

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
  async upload(@Files() files, @Fields() fields, @Param('missionid') missionid: string) {
    return {
      files,
      fields
    }
  }
}