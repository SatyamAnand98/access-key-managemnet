import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserDto } from '../store/DTO/user.dto';
import { User } from '../store/Schema/user.entity';
import { JwtGenerationService } from '../store/utils/jwt.service';
import { AccessToken } from 'src/store/Schema/token.entity';
import { EDbNames } from 'src/store/enums/dbNames';
import { CreateKeyDto, UpdateKeyDto } from 'src/store/DTO/key.dto';
import { calcExpiry } from '../store/utils/expiry.calc';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(EDbNames.USER)
    private userRepository: Model<User>,
    @InjectModel(EDbNames.ACCESS_TOKEN)
    private accessRepository: Model<AccessToken>,
    private readonly authService: AuthService,
  ) {}

  async updateAccess(updateUser: UpdateUserDto): Promise<any> {
    const user = await this.userRepository.findOneAndUpdate(
      {
        username: updateUser.username,
      },
      {
        $set: {
          isActive: updateUser.isActive,
          accessLevel: updateUser.accessLevel,
        },
      },
    );

    if (user['_doc']) {
      try {
        const accessToken = await this.authService.regenerateToken(user);
        return {
          ...user['_doc'],
          ...accessToken,
        };
      } catch (error) {
        return {
          error: error.message,
        };
      }
    } else {
      throw new Error('User not found');
    }
  }

  async createKey(createKeyDto: CreateKeyDto, req: any): Promise<any> {
    const { accessLevel, rateLimit, expiresIn } = createKeyDto;

    const user = req['user'];

    if (!user && user.accessLevel == 'admin') {
      throw new Error('User must be registered Admin to create key');
    }

    const payload = {
      rateLimit,
      username: user.username,
    };

    const newKey = new JwtGenerationService().sign(
      payload,
      expiresIn.toString(),
    );

    const newKeyObj = await new this.accessRepository({
      username: user.username,
      token: newKey,
      role: accessLevel,
      rateLimiter: rateLimit,
      expiresIn,
      expiresAt: calcExpiry(new Date(), expiresIn.toString()),
    }).save();

    return { ...newKeyObj['_doc'] };
  }

  async updateKey(
    id: string,
    updateKeyDto: UpdateKeyDto,
    req: any,
  ): Promise<any> {
    const user = req['user'];

    const existingKey = await this.accessRepository.findOne({
      _id: new mongoose.Types.ObjectId(id),
      username: user.username,
      isDeleted: false,
    });

    if (!existingKey) {
      throw new Error('Key does not exist');
    }

    existingKey.role = updateKeyDto.accessLevel;
    existingKey.rateLimiter = updateKeyDto.rateLimit;
    existingKey.expiresIn = updateKeyDto.expiresIn.toString();
    existingKey.isActive = updateKeyDto.isActive;
    existingKey.isDeleted = updateKeyDto.isDeleted
      ? updateKeyDto.isDeleted
      : false;
    existingKey.expiresAt = calcExpiry(
      new Date((existingKey as any).createdAt),
      updateKeyDto.expiresIn.toString(),
    );

    existingKey.save();

    if (existingKey) {
      return {
        ...existingKey['_doc'],
      };
    } else {
      throw new Error('Key not found');
    }
  }

  async deleteKey(id: string, req: any): Promise<any> {
    const user = req['user'];

    const deletedKey = await this.accessRepository.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        username: user.username,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          isActive: false,
        },
      },
      { new: true },
    );

    if (deletedKey) {
      return {
        message: 'Key Successfully Deleted',
      };
    } else {
      throw new Error('Key not found');
    }
  }

  async listKeys(req: any): Promise<any> {
    const user = req['user'];

    const keys = await this.accessRepository.find({
      username: user.username,
      isDeleted: false,
    });

    if (keys) {
      return keys;
    } else {
      throw new Error('No keys found');
    }
  }
}
