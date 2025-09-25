import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '@lib/common';
import { UserDocument, UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(dto: RegisterUserDto): Promise<UserDocument> {
    const exists = await this.userRepository.findByEmail(dto.email);

    if (exists) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const userToCreate = {
      ...dto,
      passwordHash,
    };

    /** Refactor: Automate mapping to RTO to exclude credentials */
    return this.userRepository.create(userToCreate);
  }

  /** Refactor: Map to RTO and exclude sensitive fields */
  async findAll(): Promise<UserDocument[]> {
    return await this.userRepository.findAll();
  }

  /** Implement: JWT-based auth for logging in a user */
}
