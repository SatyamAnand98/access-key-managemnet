import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ERole } from '../enums/role.enum';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @IsAlphanumeric(null, {
    message: 'Username does not allow other than alpha numeric chars.',
  })
  @ApiProperty({
    description: 'Username of the User',
    type: String,
    example: 'satyam_anand_',
  })
  username: string;

  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
        at least one uppercase letter, 
        one lowercase letter, 
        one number and 
        one special character`,
  })
  @ApiProperty({
    description: 'Password of the User',
    type: String,
    example: 'Satyam@123',
  })
  password: string;

  @IsBoolean()
  @ApiProperty({
    description: 'isActive of the User',
    type: Boolean,
    example: true,
  })
  isActive: boolean = true;

  @IsEnum(ERole)
  @ApiProperty({
    description: 'accessLevel of the User',
    type: String,
    example: 'user',
  })
  accessLevel: ERole = ERole.User;
}

export class UpdateUserDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @IsAlphanumeric(null, {
    message: 'Username does not allow other than alpha numeric chars.',
  })
  @ApiProperty({
    description: 'Username of the User',
    type: String,
    example: 'satyam_anand_',
  })
  username: string;

  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
        at least one uppercase letter, 
        one lowercase letter, 
        one number and 
        one special character`,
  })
  @ApiProperty({
    description: 'Password of the User',
    type: String,
    example: 'Satyam@123',
  })
  password: string;

  @IsBoolean()
  @ApiProperty({
    description: 'isActive of the User',
    type: Boolean,
    example: true,
  })
  isActive: boolean = true;

  @IsEnum(ERole)
  @ApiProperty({
    description: 'accessLevel of the User',
    type: String,
    example: 'user',
  })
  accessLevel: ERole = ERole.User;
}

export class LoginUserDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @IsAlphanumeric(null, {
    message: 'Username does not allow other than alpha numeric chars.',
  })
  @ApiProperty({
    description: 'Username of the User',
    type: String,
    example: 'satyam_anand_',
  })
  username: string;

  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
        at least one uppercase letter, 
        one lowercase letter, 
        one number and 
        one special character`,
  })
  @ApiProperty({
    description: 'Password of the User',
    type: String,
    example: 'Satyam@123',
  })
  password: string;
}
