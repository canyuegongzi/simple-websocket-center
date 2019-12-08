import { Body, Controller, Get, Inject, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from '../common/shared/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/shared/interceptors/logging.interceptor';
import { RoleService } from '../service/service/role.service';
import { CreateRoleDto } from '../model/DTO/role/create_role.dto';
import { UpdateRoleDto } from '../model/DTO/role/update_role.dto';
import {QueryRoleDto} from '../model/DTO/role/query_role.dto';
import {AddAuthDto} from '../model/DTO/role/add_auth';

@Controller('role')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
// @UseGuards(RolesGuard)
export class RoleController {
  constructor(
    @Inject(RoleService) private readonly roleService: RoleService,
  ) {}

  /*
    添加角色
   */
  @Post('add')
  public async creatUser(@Body() createUserDto: CreateRoleDto) {
    const res = await this.roleService.checkCode(createUserDto.code);
    if (res.data) {
      return  { code: 200, message: '该角色已经存在', success: false };
    }
    const res1: object = await this.roleService.creatRole(createUserDto);
    if (res) {
      return  { code: 200, message: '操作成功', success: true };
    }
    return  { code: 200, message: '操作失败', success: false };
  }

  /**
   * 更新角色
   * @param updateRoleDto
   */
  @Post('update')
  public async updateRole(@Body() updateRoleDto: UpdateRoleDto) {
    try {
      const res =  await this.roleService.updateRole(updateRoleDto);
      if (res) {
        return {code: 200, data: res, message: '更新成功', success: true};
      }else {
        return {code: 200, data: res, message: '更新失败', success: false};
      }
    }catch (e) {
      return {code: 400, message: '更新失败', success: false};
    }
  }

  @Post('delete')
  public async deleteRole(@Body('id') id: Array<number| string>) {
    try {
      const res = await this.roleService.deleteRole(id);
      return {code: 200, data: res, message: '删除成功', success: true};
    }catch (e) {
      return {code: 400, message: '删除失败', success: false};
    }
  }

  @Get('getRoleInfo')
  public async getRoleInfo(@Query('id') id: any) {
    try {
      const res = await this.roleService.getRoleInfo(id);
      return {code: 200, data: res, message: '查询成功'};
    }catch (e) {
      return {code: 200, data: [], message: '查询失败'};
    }
  }

   @Get('list')
   public async getList(@Query() params: QueryRoleDto) {
      try {
        const res = await this.roleService.getList(params);
        return {code: 200, data: res, message: '查询成功'};
      }catch (e) {
        return {code: 200, data: [], message: '查询失败'};
      }
   }

  @Post('addAuthToRole')
   public async addAuthToRole(@Body() params: AddAuthDto) {
    try {
      const res = await this.roleService.addAuthToRole(params);
      return {code:  200 , message:  '操作成功', success: true};
    } catch (e) {
      return {code: 200, message: e.errorMessage, success: false};
    }
  }

  @Get('authByRole')
  public async getAuthByRole(@Query('id') id: any) {
    try {
      const res = await this.roleService.getAuthByRole(id);
      return {code:  200 , data: res, message:  '操作成功'};
    } catch (e) {
      return {code: 200, data: [], message: e.errorMessage};
    }
  }
}
