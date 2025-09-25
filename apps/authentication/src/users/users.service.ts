import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from '@lib/common';
import { UsersRepository } from './users.repository';
import { UserDocument } from './users.schema';
import { JwtService } from '@nestjs/jwt';

export type LoginSuccessResponse = { token: string };

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto): Promise<UserDocument> {
    console.log('Registering user...');
    const exists = await this.usersRepository.findByEmail(dto.email);

    if (exists) {
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
    console.log('Logging in...');
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      console.log('User not found...');
      throw new UnauthorizedException('User not found');
    }

    const credentialsMatch = await bcrypt.compare(password, user.passwordHash);
    if (!credentialsMatch) {
      console.log("Credentials don't match...");
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('Signing token...');
    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
    });

    return { token };
  }
}
