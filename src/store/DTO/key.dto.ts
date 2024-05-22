import { IsEnum, IsNotEmpty } from 'class-validator';
import { ERole } from '../enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKeyDto {
  @IsNotEmpty()
  @IsEnum(ERole)
  @ApiProperty({
    description: 'Access Level of the User',
    type: String,
    example: 'user/ admin/ guest',
  })
  accessLevel: ERole = ERole.User;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Rate Limit of the User per hour',
    type: Number,
    example: 100,
  })
  rateLimit: number = 10;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Expiration of the Key',
    type: String,
    example: '24h',
  })
  expiresIn: String;
}

export class UpdateKeyDto {
  @IsNotEmpty()
  @IsEnum(ERole)
  @ApiProperty({
    description: 'Access Level of the User',
    type: String,
    example: 'user/ admin/ guest',
  })
  accessLevel: ERole = ERole.User;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Rate Limit of the User per hour',
    type: Number,
    example: 100,
  })
  rateLimit: number = 10;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Expiration of the Key',
    type: String,
    example: '24h',
  })
  expiresIn: String;

  @ApiProperty({
    description: 'isActive of the User',
    type: Boolean,
    example: true,
  })
  isActive: boolean = true;

  @ApiProperty({
    description: 'isDeleted of the User',
    type: Boolean,
    example: false,
  })
  isDeleted: boolean = false;
}
