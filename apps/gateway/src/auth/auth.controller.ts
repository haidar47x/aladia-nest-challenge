import { Body, Controller, Get, Post } from '@nestjs/common';
import { NetworkingService } from '@lib/core';
import { RegisterUserDto, UserRto } from '@lib/common';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly networkingService: NetworkingService) {}

  @Post('register')
  registerUser(@Body() data: RegisterUserDto) {
    return this.networkingService.authClient.send<UserRto>(
      {
        cmd: 'register-user',
      },
      data,
    );
  }

  @Get('users')
  getAllUsers(): Observable<UserRto[]> {
    return this.networkingService.authClient.send(
      {
        cmd: 'get-users',
      },
      {},
    );
  }
}
