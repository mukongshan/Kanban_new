import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import { ReportMiddleware } from './middleware/report.middleware';
import * as typegoose from '@midwayjs/typegoose';
import * as crossDomain from '@midwayjs/cross-domain';
import { UserExistFilter } from './filter/userExist.filter';
import { DefaultErrorFilter } from './filter/default.filter';
import { NotFoundFilter } from './filter/notfound.filter';
import * as koaStatic from 'koa-static';
import * as path from 'path';
import * as upload from '@midwayjs/upload';

@Configuration({
  imports: [
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    typegoose,
    crossDomain,
    upload,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    this.app.useFilter([UserExistFilter, NotFoundFilter, DefaultErrorFilter]);

    this.app.use(koaStatic(path.join(__dirname, '../uploads'))); // 提供静态文件服务，允许访问根目录下的uploads文件夹
    console.log('Server is running at', path.join(__dirname, '../uploads'));
    // Ensure upload middleware is configured properly
    // Note: You might need to configure the upload options if required
  }
}
