import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DatabaseModule } from 'src/store/Database/mongoDb.module';
import { ProducerService } from 'src/pub-sub/tokenEvents.handler';
import { PubSubModule } from 'src/pub-sub/pub-sub.module';

@Module({
  imports: [AuthModule, DatabaseModule, PubSubModule],
  controllers: [AdminController],
  providers: [AdminService, ProducerService],
  exports: [AdminService],
})
export class AdminModule {}
