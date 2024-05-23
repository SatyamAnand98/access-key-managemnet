import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ERole } from 'src/store/enums/role.enum';
import { User } from 'src/store/Schema/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EDbNames } from 'src/store/enums/dbNames';
import * as bcrypt from 'bcrypt';
import { PASSWORD_ENCRYPTION } from 'src/store/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(EDbNames.USER)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async hashPassword(plainPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(PASSWORD_ENCRYPTION.SALT_ROTATION);
    const hash = await bcrypt.hash(plainPassword, salt);
    return hash;
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new UnauthorizedException(
        'Failed to Login. Please check username and try again',
      );
    }

    if (!(await this.validatePassword(pass, user.password))) {
      throw new UnauthorizedException(
        'Failed to Login. Please check password and try again',
      );
    }
    const payload = {
      sub: user.id,
      username: user.username,
      isActive: user.isActive,
      accessLevel: [user.accessLevel],
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(
    signUpDto: Record<string, any>,
  ): Promise<{ access_token: string }> {
    const user = new this.userModel({
      username: signUpDto.username,
      password: await this.hashPassword(signUpDto.password),
      isActive: signUpDto.isActive,
      accessLevel: signUpDto.accessLevel,
    });

    await user.save();

    const payload = {
      sub: user.id,
      username: user.username,
      isActive: user.isActive,
      accessLevel: [user.accessLevel],
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async regenerateToken(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      isActive: user.isActive,
      accessLevel: [user.accessLevel],
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
