import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { RegisterUserDto } from '@lib/common';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'register-user' })
  async registerUser(dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  @MessagePattern({ cmd: 'login-user' })
  async loginUser() {
    /** To be implemented */
  }

  @MessagePattern({ cmd: 'get-users' })
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'ping' })
  ping() {
    console.log('pong');
    return 'pong';
  }
}
