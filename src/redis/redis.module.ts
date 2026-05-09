import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const redis = createClient({
          socket: {
            host: process.env.REDIS_HOST ?? 'localhost',
            port: parseInt(process.env.REDIS_PORT ?? '6379', 10)
          }
        })
        await redis.connect();
        return redis;
      }
    }
  ],
  exports: [RedisService, 'REDIS_CLIENT'],
})
export class RedisModule { }
