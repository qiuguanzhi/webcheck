import { Inject, Controller, Get, Query, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

export interface CreateUserDto {
  username: string;
}
@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;


  

  @Inject()
  userService: UserService;

  @Get('/get_user')
  async getUser(@Query('uid') uid) {
    const user = await this.userService.getUser({ uid });
    return { success: true, message: 'OK', data: user };
  }

  @Post('/create_user')
  async createUser(@Body() createUserDto: CreateUserDto) { 
    const newUser = await this.userService.createUser(createUserDto);
    return {
      success: true,
      message: 'User created',
      data: newUser,
    };
  }
}


