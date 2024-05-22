import { Module } from '@nestjs/common';
import { PubSubController } from './pub-sub.controller';
import { PubSubService } from './pub-sub.service';
@Module({
  controllers: [PubSubController],
  providers: [PubSubService],
  exports: [PubSubService],
})
export class PubSubModule {}
