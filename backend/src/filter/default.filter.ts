import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    // 所有的未分类错误会到这里
    console.log('default error filter', err.message);
    ctx.logger.error(err.message);
    return {
      success: false,
      message: err.message,
    };
  }
}
