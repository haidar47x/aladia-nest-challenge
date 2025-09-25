// users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RegisterUserDto } from '@lib/common';

describe('UsersController', () => {
  let controller: UsersController;

  // Strongly-typed mock for just the methods the controller uses
  let usersService: jest.Mocked<Pick<UsersService, 'register' | 'findAll'>>;

  beforeEach(async () => {
    usersService = {
      register: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('@MessagePattern({ cmd: "register-user" }) registerUser', () => {
    it('delegates to UsersService.register and returns the result', async () => {
      const dto: RegisterUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'Password123',
      };

      const createdUser = {
        _id: '<user-id-placeholder>',
        name: dto.name,
        email: dto.email,
        passwordHash: '<hash-placeholder>',
      };

      usersService.register.mockResolvedValue(createdUser as any);

      const result = await controller.registerUser(dto);

      expect(usersService.register).toHaveBeenCalledTimes(1);
      expect(usersService.register).toHaveBeenCalledWith(dto);
      expect(result).toBe(createdUser);
    });
  });

  describe('@MessagePattern({ cmd: "get-users" }) getAllUsers', () => {
    it('delegates to UsersService.findAll and returns the result', async () => {
      const users = [
        {
          _id: '<user-1>',
          name: 'Alice',
          email: 'alice@example.com',
          passwordHash: '<hash-1>',
        },
        {
          _id: '<user-2>',
          name: 'Bob',
          email: 'bob@example.com',
          passwordHash: '<hash-2>',
        },
      ] as any[];

      usersService.findAll.mockResolvedValue(users);

      const result = await controller.getAllUsers();

      expect(usersService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toBe(users);
    });
  });

  describe('@MessagePattern({ cmd: "ping" }) ping', () => {
    it('returns "pong" and logs "pong"', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const result = controller.ping();

      expect(logSpy).toHaveBeenCalledWith('pong');
      expect(result).toBe('pong');

      logSpy.mockRestore();
    });
  });

  describe('@MessagePattern({ cmd: "login-user" }) loginUser', () => {
    it('currently resolves to undefined (not implemented)', async () => {
      await expect(controller.loginUser()).resolves.toBeUndefined();
    });
  });
});
