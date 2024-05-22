import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ERole } from 'src/store/enums/role.enum';
import { User } from 'src/store/Schema/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EDbNames } from 'src/store/enums/dbNames';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(EDbNames.USER)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userModel.findOne({ username });
    if (!user || user.password !== pass) {
      throw new UnauthorizedException(
        'Failed to Login. Please check username and password',
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
      password: signUpDto.password,
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
