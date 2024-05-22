import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class PubSubService {
  constructor(
    @Inject('REDIS_SUBSCRIBE_CLIENT') private readonly redisClient: Redis,
  ) {}
  async publish(channel: string, message: any) {
    await this.redisClient.publish(channel, JSON.stringify(message));
  }
  async subscribe(channel: string, callback: (message: any) => void) {
    await this.redisClient.subscribe(channel);
    this.redisClient.on('message', (chnl, message) => {
      if (chnl === channel) {
        callback(JSON.parse(message));
      }
    });
  }
}
