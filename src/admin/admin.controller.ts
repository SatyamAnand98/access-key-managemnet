import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateKeyDto, UpdateKeyDto } from 'src/store/DTO/key.dto';
import { ERole } from 'src/store/enums/role.enum';
import { UpdateUserDto } from '../store/DTO/user.dto';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard)
  @Roles(ERole.Admin)
  @Put('update-access')
  async updateUser(@Body() updateUser: UpdateUserDto): Promise<any> {
    try {
      return await this.adminService.updateAccess(updateUser);
    } catch (error) {
      return { error: error.message };
    }
  }

  @UseGuards(AuthGuard)
  @Roles(ERole.Admin)
  @Post('create-key')
  async createKey(
    @Body() createKeyDto: CreateKeyDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      return await this.adminService.createKey(createKeyDto, req);
    } catch (error) {
      return { error: error.message };
    }
  }

  @UseGuards(AuthGuard)
  @Roles(ERole.Admin)
  @Put('update-key/:id')
  async updateKey(
    @Param('id') id: string,
    @Body() updateKeyDto: UpdateKeyDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      return await this.adminService.updateKey(id, updateKeyDto, req);
    } catch (error) {
      return { error: error.message };
    }
  }

  @UseGuards(AuthGuard)
  @Roles(ERole.Admin)
  @Delete('delete-key/:id')
  async deleteKey(@Param('id') id: string, @Request() req: any): Promise<any> {
    try {
      return await this.adminService.deleteKey(id, req);
    } catch (error) {
      return { error: error.message };
    }
  }

  @UseGuards(AuthGuard)
  @Roles(ERole.User)
  @Get('keys')
  async listKeys(@Request() req: any): Promise<any> {
    try {
      return await this.adminService.listKeys(req);
    } catch (error) {
      return { error: error.message };
    }
  }
}
