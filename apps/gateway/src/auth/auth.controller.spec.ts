import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { NetworkingService } from '@lib/core';
import { Logger } from '@lib/logger';
import { of, throwError } from 'rxjs';
import { ServiceUnavailableException } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto, UserRto } from '@lib/common';
import { TokenRto } from '@lib/common/rto/token.rto';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('AuthController', () => {
  let controller: AuthController;
  let networkingService: { authClient: { send: jest.Mock } };
  let logger: { setContext: jest.Mock; log: jest.Mock };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    networkingService = {
      authClient: { send: jest.fn() },
    };
    logger = {
      setContext: jest.fn(),
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: NetworkingService, useValue: networkingService },
        { provide: Logger, useValue: logger },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: Reflector, useValue: new Reflector() },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('loginUser', () => {
    it('should call networkingService.authClient.send with correct args', (done) => {
      const dto: LoginUserDto = { email: 'test@test.com', password: 'pass123' };
      const token: TokenRto = { token: 'jwt-token' };

      networkingService.authClient.send.mockReturnValue(of(token));

      controller.loginUser(dto).subscribe((result) => {
        expect(result).toEqual(token);
        expect(networkingService.authClient.send).toHaveBeenCalledWith(
          { cmd: 'login-user' },
          dto,
        );
        done();
      });
    });

    it('should propagate errors from authClient.send', (done) => {
      const dto: LoginUserDto = { email: 'fail@test.com', password: 'wrong' };
      networkingService.authClient.send.mockReturnValue(
        throwError(() => new Error('Unauthorized')),
      );

      controller.loginUser(dto).subscribe({
        error: (err) => {
          expect(err.message).toBe('Unauthorized');
          done();
        },
      });
    });
  });

  describe('registerUser', () => {
    it('should call networkingService.authClient.send with correct args', (done) => {
      const dto: RegisterUserDto = {
        email: 'new@test.com',
        password: 'abc123',
        name: 'testname',
      };
      const user: UserRto = {
        _id: '1',
        email: dto.email,
        name: 'testname',
      };

      networkingService.authClient.send.mockReturnValue(of(user));

      controller.registerUser(dto).subscribe((result) => {
        expect(result).toEqual(user);
        expect(networkingService.authClient.send).toHaveBeenCalledWith(
          { cmd: 'register-user' },
          dto,
        );
        done();
      });
    });
  });

  describe('getAllUsers', () => {
    it('should extract bearer token and call networkingService.authClient.send', (done) => {
      const users: UserRto[] = [
        {
          _id: '1',
          email: 'a@test.com',
          name: '',
        },
      ];
      networkingService.authClient.send.mockReturnValue(of(users));

      controller.getAllUsers('Bearer some-token').subscribe((result) => {
        expect(result).toEqual(users);
        expect(networkingService.authClient.send).toHaveBeenCalledWith(
          { cmd: 'get-users' },
          { token: 'some-token' },
        );
        done();
      });
    });
  });

  describe('ping', () => {
    it('should return pong when service is available', (done) => {
      networkingService.authClient.send.mockReturnValue(of('pong'));

      controller.ping().subscribe((result) => {
        expect(result).toBe('pong');
        expect(networkingService.authClient.send).toHaveBeenCalledWith(
          { cmd: 'ping' },
          {},
        );
        expect(logger.log).toHaveBeenCalledWith('Pinging...');
        done();
      });
    });

    it('should throw ServiceUnavailableException on failure', (done) => {
      networkingService.authClient.send.mockReturnValue(
        throwError(() => new Error('Connection refused')),
      );

      controller.ping().subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(ServiceUnavailableException);
          expect(err.message).toBe('Authentication service unavailable');
          done();
        },
      });
    });
  });
});
