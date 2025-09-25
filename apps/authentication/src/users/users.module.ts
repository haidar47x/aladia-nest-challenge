import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/users.schema';
import { UsersService } from '../services/users.service';
import { UserRepository } from '../repositories/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
