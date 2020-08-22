import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../model/DTO/user/creat_user.dto';
import { LoginParamsDto } from '../model/DTO/user/login_params.dto';
import {Role} from '../model/entity/role.entity';
import {QueryUserDto} from '../model/DTO/user/query_user.dto';
import {ApiException} from '../common/error/exceptions/api.exception';
import {ApiErrorCode} from '../config/api-error-code.enum';
import {User} from '../model/entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * 创建用户
   * @param user
   */
  public async creatUser(user: CreateUserDto) {
    try {
      const role =  await this.roleRepository
          .createQueryBuilder('r')
          .where('r.id = :id', { id: user.roleId || 0})
          .getOne();
      const newUser = new User();
      newUser.role = role;
      newUser.name = user.name;
      newUser.age = user.age;
      newUser.address = user.address;
      newUser.email = user.email;
      newUser.desc = user.desc || '';
      newUser.password = user.password;
      newUser.nick = user.nick || '';
      const res  =  await this.userRepository.save(newUser);
      if (res) {
        return true;
      }else {
        return false;
      }
    } catch (e) {
      return await e;
    }
  }

  /**
   * 用户登录
   * @param params
   */
  public async login(params: LoginParamsDto) {
    try {
      const res =  await this.userRepository
        .createQueryBuilder('u')
        .where('u.name = :name', { name: params.name})
        .andWhere('u.password = :password', { password: params.password})
        .getOne();
      if (res) {
        return res;
      } else {
        return false;
      }
    } catch (e) {
      return await e;
    }
  }

  /**
   * 退出登录
   * @param req
   */
  public async loginOut(req) {
    try {
      req.session.userName = null; // 删除session
      return true;
    } catch (e) {
      return await e;
    }
  }

  /**
   * 查询用户的信息
   * @param query
   */
  public async getUserInfo(query: string) {
    try {
      const res = await this.userRepository
        .createQueryBuilder('u')
        .where('u.id = :id', { id: query})
        .leftJoinAndSelect('u.role', 'role')
        .select([
            'u',
            'role.name',
            'role.id',
            'u.email',
            'u.password',
        ])
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
   * 链表查询
   * @param query
   */
  public async linkFind(query) {
    try {
      return  await this.userRepository
        .createQueryBuilder('u')
        .select(['u.id', 'u.name', 'u.desc', 'u.age', 'u.nick'])
        .leftJoinAndSelect('u.photo', 'photo')
        .where('u.id = :id', { id: query})
        .getOne();
    } catch (e) {
      throw new ApiException('密码或用户名错误', ApiErrorCode.USER_LIST_FILED, 200);
    }
  };

  /**
   * 通过用户名查看
   * @param name
   */
  public async findOneByName(name: string): Promise<User> {
    return await this.userRepository.findOne({ name });
  }

  /**
   * 查询用户列表
   * @param query
   */
   public async getList(query: QueryUserDto) {
        try {
            const res = await this.userRepository
                .createQueryBuilder('u')
                .leftJoinAndSelect('u.role', 'r')
                .leftJoinAndSelect('u.organizations', 'o' )
                .orWhere('u.name like :name', { name: `%${query.name}%`})
                .orderBy('u.name', 'ASC')
                .addSelect(['u.email'])
                .skip((query.page - 1) * query.pageSize)
                .take(query.pageSize)
                .getManyAndCount();
            return  { data: res[0], count: res[1]};
        } catch (e) {
            throw new ApiException('查询失败', ApiErrorCode.USER_LIST_FILED, 200);
        }
    }

  /**
   * 删除用户
   * @param params
   */
  async deleteUser(params: Array<string | number>) {
    try {
      return await this.userRepository
          .createQueryBuilder('u')
          .update(User)
          .set({status: 1})
          .whereInIds(params)
          .execute();
    } catch (e) {
      throw new ApiException('操作失败', ApiErrorCode.USER_LIST_FILED, 200);
    }
  }

  /**
   * 更新用户
   * @param createUserDto
   */
  public async updateUser(createUserDto: CreateUserDto) {
      try {
        let role: Role;
        try {
          role = await this.roleRepository
              .createQueryBuilder('r')
              .where('r.id = :id', { id: createUserDto.roleId || 0})
              .getOne();
        } catch (e) {
          throw new ApiException('角色不存在', ApiErrorCode.USER_LIST_FILED, 200);
        }
        return this.roleRepository
            .createQueryBuilder('u')
            .update(User)
            .set({desc: createUserDto.desc, nick: createUserDto.nick, name: createUserDto.name,
              password: createUserDto.password, role, address: createUserDto.address,
              email: createUserDto.email, age: createUserDto.age })
            .where('id = :id', { id: createUserDto.id })
            .execute();
      } catch (e) {
        throw new ApiException('操作失败', ApiErrorCode.USER_LIST_FILED, 200);
      }
  }
}
