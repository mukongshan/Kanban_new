import { MidwayConfig } from '@midwayjs/core';
import { User } from '../entity/user';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1721920175642_2032',
  koa: {
    port: 7001,
  },
  mongoose: {
    dataSource: {
      default: {
        uri: 'mongodb://localhost:27017/userDataBase',
        // options: {
        //   user: '***********',
        //   pass: '***********'
        // },
        // 关联实体
        entities: [User]
      }
    }
  },
} as MidwayConfig;
