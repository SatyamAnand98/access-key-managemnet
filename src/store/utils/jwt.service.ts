import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { accessTokenConstant } from 'src/store/constants';

export class JwtGenerationService {
  private readonly secretKey = accessTokenConstant.secret;

  sign(payload: any, expiresIn: string): string {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }
}
