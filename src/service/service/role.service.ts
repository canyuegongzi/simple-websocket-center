import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../model/entity/role.entity';
import { CreateRoleDto } from '../../model/DTO/role/create_role.dto';
import { UpdateRoleDto } from '../../model/DTO/role/update_role.dto';
import {ApiException} from '../../common/error/exceptions/api.exception';
import {ApiErrorCode} from '../../config/api-error-code.enum';
import {QueryRoleDto} from '../../model/DTO/role/query_role.dto';
import {AddAuthDto} from '../../model/DTO/role/add_auth';
import {Authority} from '../../model/entity/authority.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Authority)
    private readonly authorityRepository: Repository<Authority>,
  ) {}

  /*
   添加数据
  */
 public async creatRole(role: CreateRoleDto) {
    try {
      const newRole = new CreateRoleDto();
      newRole.name = role.name;
      newRole.desc = role.desc;
      newRole.code = role.code;
      return await this.roleRepository.save(newRole);
    } catch (e) {
      return await e;
    }
  }

  /**
   * 更新角色
   * @param role
   */
  public async updateRole(role: UpdateRoleDto) {
    try {
      const res = await this.roleRepository
      .createQueryBuilder('r')
      .update(Role)
      .set({desc: role.desc, name: role.name})
      .where('id = :id', { id: role.id })
      .execute();
      if (res) {
         return true;
      } else {
        return false;
      }
    } catch (e) {
        throw new HttpException('更新失败', 400);
    }
  }

  /**
   * 删除角色
   * @param id
   */
  public async deleteRole(id: Array<number| string>) {
    try {
      return await this.roleRepository
        .createQueryBuilder()
        .delete()
        .from(Role)
        .whereInIds(id)
        .execute();
    } catch (e) {
      throw new HttpException('删除失败', 400);
    }
  }

  /**
   * 获取角色详情
   * @param query
   */
  public async getRoleInfo(query: string) {
    try {
      return await this.roleRepository
        .createQueryBuilder('r')
        .where('r.id = :id', { id: query})
        .getOne();
    } catch (e) {
        throw new ApiException('查询失败', ApiErrorCode.ROLE_LIST_FAILED, 200);
    }
  }

  /**
   * 校验code的唯一性
   */
  public async checkCode(query: string) {
    try {
        const res = await this.roleRepository
          .createQueryBuilder('r')
          .where('r.code = :code', { code: query})
          .getOne();
        if (await res) {
          return {data: res, flag: true};
        } else {
          return {data: res, flag: false};
        }
      } catch (e) {
        return e;
      }
  }

    /**
     * 查看权限列表
     * @param query
     */
  public async getList(query: QueryRoleDto) {
      try {
          const res = await this.roleRepository
              .createQueryBuilder('r')
              .orWhere('r.name like :name', { name: `${query.name.length > 2 ? `%${query.name}%` : '%%'}`})
              .orderBy('r.name', 'ASC')
              .addOrderBy('r.code')
              .skip((query.page - 1) * query.pageSize)
              .take(query.pageSize)
              .getManyAndCount();
          return  { data: res[0], count: res[1]};
      } catch (e) {
          throw new ApiException('查询失败', ApiErrorCode.ROLE_LIST_FAILED, 200);
      }
    }

    /**
     * 给角色授权
     * @param params
     */
    public async addAuthToRole(params: AddAuthDto) {
        try {
            try {
                const role = await this.roleRepository.findOne(params.roleId, {relations: ['authority']});
                if (role === undefined) {
                    throw new ApiException('请先添加角色', ApiErrorCode.ORIZATION_CREATED_FILED, 200);
                }
                const authIds = params.authIds ? params.authIds : [];
                await this.roleRepository
                    .createQueryBuilder()
                    .relation(Role, 'authority')
                    .of(params.roleId)
                    .addAndRemove(authIds, role.authority.map( u => u.id));
                return await this.roleRepository.findOne(params.roleId, {relations: [ 'authority' ]});
            }catch (e) {
                console.log(e);
                throw new ApiException(e.errorMessage || '操作失败', ApiErrorCode.ORIZATION_CREATED_FILED, 200);
            }
        }catch (e) {
            throw new ApiException(e.errorMessage, ApiErrorCode.ROLE_LIST_FAILED, 200);
        }
    }

    /**
     * 查询当前角色下的权限
     * @param id
     */
    public async getAuthByRole(id: any) {
        try {
            const res = await this.roleRepository
                .createQueryBuilder('r')
                .leftJoinAndSelect('r.authority', 'a')
                .where('r.id = :id', { id})
                .select([
                    'r.name',
                    'r.id',
                    'a',
                ])
                .getManyAndCount();
            return  { data: res[0], count: res[1]};
        } catch (e) {
            throw new ApiException('查询失败', ApiErrorCode.ROLE_LIST_FAILED, 200);
        }
    }
}
