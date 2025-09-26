import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoginUserDto, RegisterUserDto } from '@lib/common';
import { Logger } from '@lib/logger';
import { firstValueFrom } from 'rxjs';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { JwtAuthGuard } from '../jwt-auth.guard';

describe('UsersController', () => {
  let controller: UsersController;

  let usersService: jest.Mocked<
    Pick<UsersService, 'register' | 'login' | 'findAll'>
  >;
  let logger: { setContext: jest.Mock; log: jest.Mock };

  beforeEach(async () => {
    usersService = {
      register: jest.fn(),
      login: jest.fn(),
      findAll: jest.fn(),
    };

    logger = {
      setContext: jest.fn(),
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: Logger, useValue: logger },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('sets logger context in constructor', () => {
    expect(logger.setContext).toHaveBeenCalledTimes(1);
    expect(logger.setContext).toHaveBeenCalledWith(UsersController.name);
  });

  describe('@MessagePattern({ cmd: "register-user" }) registerUser', () => {
    it('delegates to UsersService.register and returns the result', async () => {
      const dto: RegisterUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
      };

      const createdUser = {
        _id: '<user-id-placeholder>',
        name: dto.name,
        email: dto.email,
      } as any;

      usersService.register.mockResolvedValue(createdUser);

      const result = await controller.registerUser(dto);

      expect(usersService.register).toHaveBeenCalledTimes(1);
      expect(usersService.register).toHaveBeenCalledWith(dto);
      expect(result).toBe(createdUser);
    });
  });

  describe('@MessagePattern({ cmd: "login-user" }) loginUser', () => {
    it('delegates to UsersService.login with email and password and returns the result', async () => {
      const dto: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'Password123!',
      };

      const token = { accessToken: '<jwt-token-placeholder>' } as any;

      usersService.login.mockResolvedValue(token);

      const result = await controller.loginUser(dto);

      expect(usersService.login).toHaveBeenCalledTimes(1);
      expect(usersService.login).toHaveBeenCalledWith(dto.email, dto.password);
      expect(result).toBe(token);
    });
  });

  describe('@MessagePattern({ cmd: "get-users" }) getAllUsers', () => {
    it('delegates to UsersService.findAll and returns the result', async () => {
      const users = [
        { _id: '<user-1>', name: 'John Doe', email: 'johndoe@example.com' },
        { _id: '<user-2>', name: 'Jane Doe', email: 'janedoe@example.com' },
      ] as any[];

      usersService.findAll.mockResolvedValue(users);

      const result = await controller.getAllUsers();

      expect(usersService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toBe(users);
    });

    it('is protected by JwtAuthGuard', () => {
      const guards = Reflect.getMetadata(
        GUARDS_METADATA,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        UsersController.prototype.getAllUsers,
      ) as unknown[];

      expect(Array.isArray(guards)).toBe(true);
      expect(guards).toContain(JwtAuthGuard);
    });
  });

  describe('@MessagePattern({ cmd: "ping" }) ping', () => {
    it('logs "Pong..." and returns an observable that emits "pong"', async () => {
      const obs$ = controller.ping();

      expect(logger.log).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenCalledWith('Pong...');

      await expect(firstValueFrom(obs$)).resolves.toBe('pong');
    });
  });
});
