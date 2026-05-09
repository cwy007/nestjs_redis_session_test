import { Inject, Injectable } from '@nestjs/common';
import { type RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient: RedisClientType;

  async hashGet(key: string): Promise<Record<string, string>> {
    return this.redisClient.hGetAll(key);
  }

  async hashSet(key: string, value: Record<string, string>, ttl?: number): Promise<void> {
    for (const [field, val] of Object.entries(value)) {
      await this.redisClient.hSet(key, field, val);
    }
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async hashDelete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
