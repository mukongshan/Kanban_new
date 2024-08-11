import { Provide } from '@midwayjs/core';
import { User } from '../entity/user';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectEntityModel } from '@midwayjs/typegoose';
import UserExistError from '../errors/UserExistError';
import UserLoginError from '../errors/UserLoginError';

@Provide()
export class UserService {

  @InjectEntityModel(User)
  userModel: ReturnModelType<typeof User>;

  async getUser() {
    // create data
    const { _id: id } = await this.userModel.create({
      username: 'JohnDoe',
      email: '123@qq.com',
      password: '123456'
    } as User); // an "as" assertion, to have types for all properties

    // find data
    const user = await this.userModel.findById(id).exec();
    console.log(user)
  }

  async registerUser(_username: string, _email: string, _password: string) {
    try {
      console.log('开始注册...');
      let isExist = await this.userExists(_username);
      if (isExist) {
        console.log('用户名已存在 *_*');
        throw new UserExistError('用户名已存在');
      }
      await this.userModel.create({
        username: _username,
        email: _email,
        password: _password,
        projects: [],
      });
      console.log('注册成功 ^_^');

    } catch (error) {
      throw new Error(`注册失败: ${error.message}`);
    }
  }

  async loginUser(username: string, password: string) {
    const user = await this.userModel.findOne({ username, password }).exec();
    if (!user) {
      throw new UserLoginError('用户名或密码不正确');
    }
    return user;
  }

  async userExists(username: string): Promise<boolean> {
    console.log('查询中...');
    const user = await this.userModel.findOne({ username }).exec();
    console.log('查询结束');
    return user !== null;
  }

}
