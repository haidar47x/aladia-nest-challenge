import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { of } from 'rxjs';
import { NetworkingService } from '@lib/core';
import { LoginUserDto, RegisterUserDto, UserRto } from '@lib/common';
import { ClientProxy } from '@nestjs/microservices';

describe('AuthController', () => {
  let authController: AuthController;

  let networkingService: Pick<NetworkingService, 'authClient'>;
  let sendMock: jest.MockedFunction<ClientProxy['send']>;

  beforeEach(async () => {
    sendMock = jest.fn() as jest.MockedFunction<ClientProxy['send']>;
    networkingService = {
      authClient: { send: sendMock } as unknown as ClientProxy,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: NetworkingService,
          useValue: networkingService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('loginUser', () => {
    it('should call auth service and return its response', (done) => {
      const dto: LoginUserDto = {
        email: 'user@example.com',
        password: 'fake-strong-password',
      };

      const resp = { token: 'fake-jwt-token' };
      sendMock.mockReturnValue(of(resp));

      authController.loginUser(dto).subscribe((value) => {
        expect(sendMock).toHaveBeenCalledWith({ cmd: 'login-user' }, dto);
        expect(value).toEqual(resp);
        done();
      });
    });
  });

  describe('registerUser', () => {
    it('should call auth service and return created user', (done) => {
      const dto: RegisterUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'fake-strong-password',
      };

      const user: UserRto = {
        _id: '<id-placeholder>',
        name: 'John',
        email: 'john@example.com',
      } as UserRto;

      sendMock.mockReturnValue(of(user));

      authController.registerUser(dto).subscribe((value) => {
        expect(sendMock).toHaveBeenCalledWith({ cmd: 'register-user' }, dto);
        expect(value).toEqual(user);
        done();
      });
    });
  });

  describe('getAllUsers', () => {
    it('should call auth service and return users', (done) => {
      const users: UserRto[] = [
        { _id: '<id-1>', name: 'A', email: 'user@example.com' } as UserRto,
      ];
      sendMock.mockReturnValue(of(users));

      authController.getAllUsers().subscribe((value) => {
        expect(sendMock).toHaveBeenCalledWith({ cmd: 'get-users' }, {});
        expect(value).toEqual(users);
        done();
      });
    });
  });

  describe('ping', () => {
    it('should call ping command', (done) => {
      sendMock.mockReturnValue(of('<pong-placeholder>'));
      authController.ping().subscribe((value) => {
        expect(sendMock).toHaveBeenCalledWith({ cmd: 'ping' }, {});
        expect(value).toBe('<pong-placeholder>');
        done();
      });
    });
  });
});
