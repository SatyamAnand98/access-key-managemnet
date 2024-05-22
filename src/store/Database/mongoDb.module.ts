import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessTokenSchema } from '../Schema/token.entity';
import { UserSchema } from '../Schema/user.entity';
import { EDbNames } from '../enums/dbNames';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EDbNames.ACCESS_TOKEN, schema: AccessTokenSchema },
      { name: EDbNames.USER, schema: UserSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
