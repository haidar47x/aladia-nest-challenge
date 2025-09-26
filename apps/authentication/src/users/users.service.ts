import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto, UserRto } from '@lib/common';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@lib/logger';
import { TokenRto } from '@lib/common/rto/token.rto';
import { plainToInstance } from 'class-transformer';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    @Inject(Logger) private readonly logger: Logger,
  ) {
    this.logger.setContext(UsersService.name);
  }

  async register(dto: RegisterUserDto): Promise<UserRto> {
    const exists = await this.usersRepository.findByEmail(dto.email);

    if (exists) {
      this.logger.log('Email already exists: ' + dto.email);
      throw new RpcException(new ConflictException('Email already exists'));
    }

    let passwordHash: string;
    try {
      passwordHash = await bcrypt.hash(dto.password, 10);
    } catch (err) {
      throw new RpcException(err);
    }

    const userToCreate = {
      ...dto,
      passwordHash,
    };

    const createdUser = await this.usersRepository.create(userToCreate);
    return plainToInstance(UserRto, createdUser, {
      excludeExtraneousValues: true,
    });
  }

  async findAll() {
    const users = await this.usersRepository.findAll();
    return users.map((user) => plainToInstance(UserRto, user));
  }

  async login(email: string, password: string): Promise<TokenRto> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      this.logger.log('User not found: ' + email);
      throw new RpcException(new UnauthorizedException("Email doesn't exists"));
    }

    const credentialsMatch = await bcrypt.compare(password, user.passwordHash);
    if (!credentialsMatch) {
      this.logger.log("Credentials don't match...");
      throw new RpcException(new UnauthorizedException('Invalid credentials'));
    }

    const token = this.jwtService.sign({
      _id: user._id,
      email: user.email,
    });

    this.logger.log('Signing token for: ' + user.email);
    return plainToInstance(TokenRto, { token });
  }
}
