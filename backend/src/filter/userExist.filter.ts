import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import UserExistError from '../errors/UserExistError';

@Catch(UserExistError)
export class UserExistFilter {
    async catch(err: UserExistError, ctx: Context) {
        //错误还不会到这里
        console.log(err.message);
        ctx.logger.error(err.message);
        ctx.status = 400; // 400 Bad Request 状态码
        ctx.body = {
            message: 'A user error occurred',
            error: err.message,
        };
    }
}
