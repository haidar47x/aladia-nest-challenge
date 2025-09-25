import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { LoginUserDto, RegisterUserDto } from '@lib/common';
import { of } from 'rxjs';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'register-user' })
  async registerUser(dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  @MessagePattern({ cmd: 'login-user' })
  async loginUser(dto: LoginUserDto) {
    return this.usersService.login(dto.email, dto.password);
  }

  @MessagePattern({ cmd: 'get-users' })
  async getAllUsers() {
    console.log('Getting all users...');
    return this.usersService.findAll();
  }

  /** Meant for testing only */
  @MessagePattern({ cmd: 'ping' })
  ping() {
    console.log('pong');
    return of('pong');
  }
}
