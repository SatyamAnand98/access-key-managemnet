import { Module } from '@nestjs/common';
import { PubSubController } from './pub-sub.controller';
import { PubSubService } from './pub-sub.service';
import Redis from 'ioredis';
@Module({
  controllers: [PubSubController],
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
    PubSubService,
  ],
  exports: [PubSubService],
})
export class PubSubModule {}
