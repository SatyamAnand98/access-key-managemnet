import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_WRITE_CLIENT') private readonly redisClient: Redis,
  ) {}

  async setKey(key: string, value: any) {
    await this.redisClient.set(key, JSON.stringify(value));
  }

  async getKey(key: string): Promise<any | null> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async clearKey(key: string) {
    await this.redisClient.del(key);
  }
}
