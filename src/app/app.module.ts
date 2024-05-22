import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from 'src/admin/admin.module';
import { DatabaseModule } from 'src/store/Database/mongoDb.module';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { LoggingMiddleware } from 'src/store/middlewares/logging-middleware';
import { RequestIdMiddleware } from 'src/store/middlewares/request-id.middleware';
import { AllExceptionsFilter } from 'src/store/middlewares/http-exception.filter';

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
    Logger,
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
