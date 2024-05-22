import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisController } from './redis.controller';
import { RedisService } from './redis.service';

@Module({
  controllers: [RedisController],
  providers: [
    {
      provide: 'REDIS_SUBSCRIBE_CLIENT',
      useFactory: () => {
        return new Redis({
          host: 'localhost',
          port: 6379,
        });
      },
    },
    {
      provide: 'REDIS_WRITE_CLIENT',
      useFactory: () => {
        return new Redis({
          host: 'localhost',
          port: 6379,
        });
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
