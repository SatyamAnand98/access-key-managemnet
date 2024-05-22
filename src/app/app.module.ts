import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AdminModule } from 'src/admin/admin.module';
import { DatabaseModule } from 'src/store/Database/mongoDb.module';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // ThrottlerModule.forRoot({
    //   throttlers: [
    //     {
    //       ttl: 10 * 1000,
    //       limit: 20,
    //     },
    //   ],
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.development.env'],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: 'Access_token_management',
    }),
    DatabaseModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
