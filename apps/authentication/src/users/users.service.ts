import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '@lib/common';
import { UsersRepository } from './users.repository';
import { UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async register(dto: RegisterUserDto): Promise<UserDocument> {
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

  /** Implement: JWT-based auth for logging in a user */
}
