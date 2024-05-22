import { ERole } from '../enums/role.enum';
// import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// @Entity()
// export class UserSchema {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'varchar', length: 20, unique: true })
//   username: string;

//   @Column({ type: 'varchar' })
//   password: string;

//   @Column({ type: 'boolean' })
//   isActive: boolean;

//   @Column({ type: 'enum', enum: ERole })
//   accessLevel: string;
// }

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'User', timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: true, enum: ERole })
  accessLevel: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
