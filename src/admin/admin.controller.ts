import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { CreateKeyDto, UpdateKeyDto } from 'src/store/DTO/key.dto';
import { ERole } from 'src/store/enums/role.enum';
import { UpdateUserDto } from '../store/DTO/user.dto';
import { AdminService } from './admin.service';
import { IResponse } from 'src/store/interfaces/response.interface';
import { STATUS_CODES } from 'http';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(ERole.Admin)
  @Put('update-access')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Body() updateUser: UpdateUserDto): Promise<IResponse> {
    const responseObj: IResponse = {
      data: await this.adminService.updateAccess(updateUser),
      message: 'User updated successfully',
      metadata: {
        error: false,
      },
    };

    return responseObj;
  }

  @Roles(ERole.Admin)
  @Post('create-key')
  @HttpCode(HttpStatus.CREATED)
  async createKey(
    @Body() createKeyDto: CreateKeyDto,
    @Request() req: any,
  ): Promise<IResponse> {
    const responseObj: IResponse = {
      data: await this.adminService.createKey(createKeyDto, req),
      message: 'Key created successfully',
      metadata: {
        error: false,
      },
    };

    return responseObj;
  }

  @Roles(ERole.Admin)
  @Put('update-key/:id')
  @HttpCode(HttpStatus.OK)
  async updateKey(
    @Param('id') id: string,
    @Body() updateKeyDto: UpdateKeyDto,
    @Request() req: any,
  ): Promise<IResponse> {
    const responseObj: IResponse = {
      data: await this.adminService.updateKey(id, updateKeyDto, req),
      message: 'Key updated successfully',
      metadata: {
        error: false,
      },
    };

    return responseObj;
  }

  @Roles(ERole.Admin)
  @Delete('delete-key/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteKey(@Param('id') id: string, @Request() req: any): Promise<void> {
    await this.adminService.deleteKey(id, req);
    // let responseObj: IResponse = {
    //   data: await this.adminService.deleteKey(id, req),
    //   message: 'Key deleted successfully',
    //   metadata: {
    //     error: false,
    //   },
    // };

    // return responseObj;
  }

  @Roles(ERole.Admin)
  @Get('keys')
  @HttpCode(HttpStatus.OK)
  async listKeys(@Request() req: any): Promise<IResponse> {
    let responseObj: IResponse = {
      data: await this.adminService.listKeys(req),
      message: 'Keys retrieved successfully',
      metadata: {
        error: false,
      },
    };
    return responseObj;
  }
}
