import { Controller, Post, Body, Inject } from '@midwayjs/core';
import { UserService } from '../service/ui.service';

@Controller('/ui')
export class UserController {

  @Inject()
  userService: UserService;

  @Post('/register')
  async register(@Body() body: { username: string; email: string; password: string }) {
    console.log('2');
    const { username, email, password } = body;
    try {
      await this.userService.registerUser(username, email, password);
      return {
        success: true,
        message: 'register successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    try {
      await this.userService.loginUser(username, password);
      return {
        success: true,
        message: 'login successfully',
      };

    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}
