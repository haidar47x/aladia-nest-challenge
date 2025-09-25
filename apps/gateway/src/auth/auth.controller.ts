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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(
    private readonly networkingService: NetworkingService,
    @Inject(Logger) private readonly logger: Logger,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @ApiOperation({
    summary: 'Logs in a user',
  })
  @ApiResponse({
    status: 201,
    description: 'Returns JWT token upon successful login.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
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
  @ApiOperation({
    summary: 'Registers a user',
  })
  @ApiResponse({
    status: 201,
    description: 'Returns newly created user upon successful registration.',
    type: UserRto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Email already exists.',
  })
  registerUser(@Body() data: RegisterUserDto): Observable<UserRto> {
    return this.networkingService.authClient.send<UserRto>(
      {
        cmd: 'register-user',
      },
      data,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiResponse({
    status: 201,
    description: 'Returns a list of all users.',
    type: [UserRto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
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
  @ApiOperation({
    summary: 'Checks liveliness of authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns "pong" upon successful ping.',
    type: String,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error if something is wrong',
  })
  ping() {
    this.logger.log('Pinging...');
    return this.networkingService.authClient.send<string>({ cmd: 'ping' }, {});
  }
}
