import { Controller, Inject, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { LoginUserDto, RegisterUserDto } from '@lib/common';
import { of } from 'rxjs';
import { Logger } from '@lib/logger';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(Logger) private readonly logger: Logger,
  ) {
    this.logger.setContext(UsersController.name);
  }

  @MessagePattern({ cmd: 'register-user' })
  async registerUser(dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  @MessagePattern({ cmd: 'login-user' })
  async loginUser(dto: LoginUserDto) {
    return this.usersService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern({ cmd: 'get-users' })
  async getAllUsers() {
    return this.usersService.findAll();
  }

  /** Meant for testing only */
  @MessagePattern({ cmd: 'ping' })
  ping() {
    this.logger.log('Pong...');
    return of('pong');
  }
}
