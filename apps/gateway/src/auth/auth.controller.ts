import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NetworkingService } from '@lib/core';
import { LoginUserDto, RegisterUserDto, UserRto } from '@lib/common';
import { Observable } from 'rxjs';
import { Logger } from '@lib/logger';

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(
    private readonly networkingService: NetworkingService,
    @Inject(Logger) private readonly logger: Logger,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Post('login')
  loginUser(@Body() data: LoginUserDto): Observable<any> {
    return this.networkingService.authClient.send<any>(
      {
        cmd: 'login-user',
      },
      data,
    );
  }

  @Post('register')
  registerUser(@Body() data: RegisterUserDto): Observable<UserRto> {
    return this.networkingService.authClient.send<UserRto>(
      {
        cmd: 'register-user',
      },
      data,
    );
  }

  @Get('users')
  getAllUsers(
    @Headers('authorization') authHeader: string,
  ): Observable<UserRto[]> {
    const token = authHeader?.split(' ')[1]; // Bearer <token>
    return this.networkingService.authClient.send<UserRto[]>(
      { cmd: 'get-users' },
      { token },
    );
  }

  @Get('ping')
  ping() {
    this.logger.log('Pinging...');
    return this.networkingService.authClient.send<string>({ cmd: 'ping' }, {});
  }
}
