import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from '@lib/common';
import { UsersRepository } from './users.repository';
import { UserDocument } from './users.schema';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@lib/logger';

export type LoginSuccessResponse = { token: string };

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    @Inject(Logger) private readonly logger: Logger,
  ) {
    this.logger.setContext(UsersService.name);
  }

  async register(dto: RegisterUserDto): Promise<UserDocument> {
    const exists = await this.usersRepository.findByEmail(dto.email);

    if (exists) {
      this.logger.log('Email already exists: ' + dto.email);
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const userToCreate = {
      ...dto,
      passwordHash,
    };

    /** Refactor: Automate mapping to RTO to exclude credentials */
    return this.usersRepository.create(userToCreate);
  }

  /** Refactor: Map to RTO and exclude sensitive fields */
  async findAll() {
    return await this.usersRepository.findAll();
  }

  async login(email: string, password: string): Promise<LoginSuccessResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      this.logger.log('User not found: ' + email);
      throw new UnauthorizedException('User not found');
    }

    const credentialsMatch = await bcrypt.compare(password, user.passwordHash);
    if (!credentialsMatch) {
      this.logger.log("Credentials don't match...");
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
    });

    this.logger.log('Signing token for: ' + user.email);
    return { token };
  }
}
