// import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// @Entity()
// export class AccessToken {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'number', foreignKeyConstraintName: id })
//   userId: string;

//   @Column({ type: 'varchar' })
//   token: string;

//   @Column()
//   accessLevel: string;

//   @Column({ default: 0 })
//   rateLimiter: number;

//   @Column()
//   expiry: Date;

//   @Column({ default: false })
//   isDeleted: boolean;

//   @Column({ default: Date.now })
//   issuedAt: Date;
// }

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ERole } from '../enums/role.enum';

@Schema({ collection: 'AccessTokens', timestamps: true })
export class AccessToken extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true, enum: ERole })
  role: string;

  @Prop({ default: 0 })
  rateLimiter: number;

  @Prop({ required: true })
  expiresIn: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: Date.now })
  issuedAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: null })
  expiresAt: Date;
}

export const AccessTokenSchema = SchemaFactory.createForClass(AccessToken);
