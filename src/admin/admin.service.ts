import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { ProducerService } from 'src/pub-sub/tokenEvents.handler';
import { CreateKeyDto, UpdateKeyDto } from 'src/store/DTO/key.dto';
import { AccessToken } from 'src/store/Schema/token.entity';
import { EDbNames } from 'src/store/enums/dbNames';
import { UpdateUserDto } from '../store/DTO/user.dto';
import { User } from '../store/Schema/user.entity';
import { calcExpiry } from '../store/utils/expiry.calc';
import { JwtGenerationService } from '../store/utils/jwt.service';
import { IEvent } from 'src/store/interfaces/events.interface';
import { EEvents } from 'src/store/enums/events.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(EDbNames.USER)
    private userRepository: Model<User>,
    @InjectModel(EDbNames.ACCESS_TOKEN)
    private accessRepository: Model<AccessToken>,
    private readonly authService: AuthService,
    private readonly pubSub: ProducerService,
  ) {}

  async updateAccess(updateUser: UpdateUserDto): Promise<Object> {
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

  async createKey(createKeyDto: CreateKeyDto, req: any): Promise<Object> {
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

    const tokenInfo: IEvent = {
      role: accessLevel,
      username: user.username,
      token: newKey,
      rateLimiter: rateLimit,
      iat: new Date(),
      exp: calcExpiry(new Date(), expiresIn.toString()),
      eventType: EEvents.CREATE_KEY,
      isActive: true,
    };

    this.pubSub.publishToken(JSON.stringify(tokenInfo));

    return { ...newKeyObj['_doc'] };
  }

  async updateKey(
    id: string,
    updateKeyDto: UpdateKeyDto,
    req: any,
  ): Promise<Object> {
    const user = req['user'];

    const existingKey = await this.accessRepository.findOne({
      _id: new mongoose.Types.ObjectId(id),
      username: user.username,
      isDeleted: false,
    });

    if (!existingKey) {
      throw new Error('Key does not exist');
    }

    existingKey.role = updateKeyDto.accessLevel ?? existingKey.role;
    existingKey.rateLimiter = updateKeyDto.rateLimit ?? existingKey.rateLimiter;
    existingKey.expiresIn =
      updateKeyDto.expiresIn.toString() ?? existingKey.expiresIn;
    existingKey.isActive = updateKeyDto.isActive ?? existingKey.isActive;
    existingKey.isDeleted = updateKeyDto.isDeleted ?? existingKey.isDeleted;
    existingKey.expiresAt = updateKeyDto.expiresIn
      ? calcExpiry(
          new Date((existingKey as any).createdAt),
          updateKeyDto.expiresIn.toString(),
        )
      : existingKey.expiresAt;

    existingKey.save();

    if (existingKey) {
      const tokenInfo: IEvent = {
        role: updateKeyDto.accessLevel,
        username: user.username,
        token: existingKey.token,
        rateLimiter: existingKey.rateLimiter,
        iat: existingKey['_doc']['createdAt'],
        exp: existingKey.expiresAt,
        eventType: EEvents.UPDATE_KEY,
        isActive: existingKey.isActive,
      };

      this.pubSub.publishToken(JSON.stringify(tokenInfo));

      return {
        ...existingKey['_doc'],
      };
    } else {
      throw new Error('Key not found');
    }
  }

  async deleteKey(id: string, req: any): Promise<Object> {
    const user = req['user'];

    const keyInfo = await this.accessRepository.findOne({
      _id: new mongoose.Types.ObjectId(id),
      username: user.username,
      isDeleted: false,
    });

    if (keyInfo) {
      keyInfo.isDeleted = true;
      keyInfo.isActive = false;

      keyInfo.save();
      const tokenInfo: IEvent = {
        token: keyInfo.token,
        eventType: EEvents.DELETE_KEY,
      };

      this.pubSub.publishToken(JSON.stringify(tokenInfo));

      return {
        message: 'Key Successfully Deleted',
      };
    } else {
      throw new Error('Key not found');
    }
  }

  async listKeys(req: any): Promise<Array<Object>> {
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
