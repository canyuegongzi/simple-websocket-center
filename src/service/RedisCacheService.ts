import {HttpService, Inject, Injectable} from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
@Injectable()
export class RedisCacheService {
    public client;
    constructor(@Inject(RedisService) private redisService: RedisService) {
        this.getClient().then(r => {} );
    }
    async getClient() {
        this.client = await this.redisService.getClient();
    }

    // 设置值的方法
    async set(key: string, value: any, seconds?: number) {
        value = JSON.stringify(value);
        if (!this.client) {
            await this.getClient();
        }
        if (!seconds) {
            await this.client.set(key, value);
        } else {
            await this.client.set(key, value, 'EX', seconds);
        }
    }

    // 获取值的方法
    async get(key: string) {
        if (!this.client) {
            await this.getClient();
        }
        const data: any = await this.client.get(key);
        if (!data) { return; }
        return JSON.parse(data);
    }

    // 删除
    async delete(key: string) {
        if (!this.client) {
            await this.getClient();
        }
        const flag = await this.client.del(key);
        return flag;
    }
}