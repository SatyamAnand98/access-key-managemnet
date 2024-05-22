import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { ERole } from 'src/store/enums/role.enum';

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should update user access', async () => {
    const updateUserDto = {
      username: 'sample-username',
      password: 'sample-password',
      isActive: true,
      accessLevel: ERole.Admin,
    };
    const result = await controller.updateUser(updateUserDto);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('username', 'sample-username');
    expect(result).toHaveProperty('accessLevel', ERole.Admin);
    expect(result).toHaveProperty('isActive', true);
  });

  it('should create a new key', async () => {
    const createKeyDto = {
      name: 'sample-key-name',
      accessLevel: ERole.Admin,
      rateLimit: 100,
      expiresIn: '24h',
    };
    const req = {
      user: {
        id: 'sample-user-id',
        username: 'sample-username',
        role: ERole.Admin,
      },
    };
    const result = await controller.createKey(createKeyDto, req);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('name', 'sample-key-name');
    expect(result).toHaveProperty('accessLevel', ERole.Admin);
    expect(result).toHaveProperty('rateLimit', 100);
    expect(result).toHaveProperty('expiresIn', '24h');
  });

  it('should update a key', async () => {
    const id = 'sample-id';
    const updateKeyDto = {
      name: 'updated-key-name',
      accessLevel: ERole.Admin,
      rateLimit: 200,
      expiresIn: '48h',
      isActivated: true,
      isDeleted: false,
      isActive: true,
    };
    const req = {
      user: {
        id: 'sample-user-id',
        username: 'sample-username',
        role: ERole.Admin,
      },
    };
    const result = await controller.updateKey(id, updateKeyDto, req);
    expect(result).toBeDefined();
  });

  it('should delete a key', async () => {
    const id = 'sample-id';
    const req = {
      user: {
        id: 'sample-user-id',
        username: 'sample-username',
        role: ERole.Admin,
      },
    };
    const result = await controller.deleteKey(id, req);
    expect(result).toBeDefined();
  });

  it('should list all keys', async () => {
    const req = {
      user: {
        id: 'sample-user-id',
        username: 'sample-username',
        role: ERole.Admin,
      },
    };
    const result = await controller.listKeys(req);
    expect(result).toBeDefined();
  });
});
