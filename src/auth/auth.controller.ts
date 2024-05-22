import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from 'src/store/DTO/user.dto';
import { Public } from '../store/constants';
import { AuthService } from './auth.service';
import { IResponse } from 'src/store/interfaces/response.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Get('login')
  async signIn(@Query() signInDto: LoginUserDto): Promise<IResponse> {
    const responseObj: IResponse = {
      data: await this.authService.signIn(
        signInDto.username,
        signInDto.password,
      ),
      message: 'User logged in successfully',
      metadata: {
        error: false,
      },
    };

    return responseObj;
  }

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('register')
  async signUp(@Body() signUpDto: CreateUserDto): Promise<IResponse> {
    const responseObj: IResponse = {
      data: await this.authService.signUp(signUpDto),
      message: 'User registered successfully',
      metadata: {
        error: false,
      },
    };

    return responseObj;
  }

  @Get('profile')
  getProfile(@Request() req: Request): IResponse {
    console.log(req['user']);
    const responseObj: IResponse = {
      data: req['user'],
      message: 'User profile fetched successfully',
      metadata: {
        error: false,
      },
    };

    return responseObj;
  }
}
