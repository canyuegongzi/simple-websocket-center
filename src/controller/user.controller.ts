import {Body, Controller, Get, Inject, Post, Query, Req, Session, UseGuards, UseInterceptors, HttpCode} from '@nestjs/common';
import { CreateUserDto } from '../model/DTO/user/creat_user.dto';
import { LoginParamsDto } from '../model/DTO/user/login_params.dto';
import { AuthService } from '../common/auth/auth.service';
import { TransformInterceptor } from '../common/shared/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/shared/interceptors/logging.interceptor';
import { UserService } from '../service/user.service';
import { RedisService } from 'nestjs-redis';
import config, {redisConfig} from '../config/config';
import {AuthGuard} from '@nestjs/passport';
import {QueryUserDto} from '../model/DTO/user/query_user.dto';

@Controller('user')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
// @UseGuards(AuthGuard)
export class UserController {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(AuthService) private readonly authService: AuthService,
    // @Inject(RedisService) private readonly redisService: RedisService,
) {}

  @Post('register')
  public async creatUser(@Body() createUserDto: CreateUserDto) {
    const res = await this.userService.findOneByName(createUserDto.name);
    if (res) {
      return  { code: 200, message: '用户名被占用', success: false };
    }
    const res1 = await this.userService.creatUser(createUserDto);
    if (res1)  {
      return  { code: 200, message: '注册成功', success: true };
    }
  }

  @Post('login')
  @HttpCode(200)
  public async login(@Body() params: LoginParamsDto, @Req() req, @Session() session) {
    const res =  await this.userService.login(params);
    console.log(res)
    // const client = await this.redisService.getClient();
    if (session && session.userName && session.userName === params.name) {
     // const newToken = await client.get(res.id);
      return  { code: 200, message: '你已经登陆' };
    }
    if (res) {
      session.userName = params.name;
      const resToken = await this.authService.creatToken({name: params.name});
      // const userToken = await client.get(res.id);
      // tslint:disable-next-line:curly
      // if (userToken) client.del(res.id);
      // client.set(res.id, resToken.accessToken);
      // client.expire(res.id, config.tokenSetTimeOut);
      return  { code: 200, message: '登录成功', data: resToken, success: true };
    }
    return  { code: 200, message: '用户名或者密码错误', success: false };
  }

  @Post('loginOut')
  public async loginOut(@Req() req) {
    const res =  await this.userService.loginOut(req);
    if (await res) {
      return  { code: 200, message: '操作成功', success: true };
    }
    return  { code: 200, message: '操作失败' , success: false};
  }

  // authorization    : Bearer eyJhbGciOiJ
  @Get('getUserInfo')
  public async getUserInfo(@Query('id') query ) {
    const res = await this.userService.getUserInfo(query);
    if (await res.flag) {
      return  { code: 200, message: '查询成功', data: res.data};
    }
    return {code: 200, message: '查询失败', data: null};
  }

  @Get('getLinkFind')
  public async linkFind(@Query('id') query: string) {
    const res = await this.userService.linkFind(query);
    // @ts-ignore
    if (await res.flag) {
      // @ts-ignore
      return  { code: 200, message: '查询成功', data: res.data};
    }
    return {code: 200, message: '查询失败', data: null};
  }

  @Get('list')
  public async getList(@Query() params: QueryUserDto) {
    try {
      const res = await this.userService.getList(params);
      return {code: 200, data: res, message: '查询成功'};
    }catch (e) {
      return {code: 200, data: [], message: '查询失败'};
    }
  }

  @Post('delete')
  public async deleteUser(@Body('id') params: Array<string | number>) {
    try {
      console.log(params);
      const res = await this.userService.deleteUser(params);
      return {code: 200,  message: '操作成功', success: true};
    }catch (e) {
      return {code: 200,  message: '操作失败', success: false};
    }
  }

  @Post('update')
  public async updateUser(@Body() createUserDto: CreateUserDto) {
    try {
      await this.userService.updateUser(createUserDto);
      return  { code: 200, message: '操作成功', success: true };
    } catch (e) {
      return  { code: 200, message: '操作失败', success: false };
    }
  }
}
