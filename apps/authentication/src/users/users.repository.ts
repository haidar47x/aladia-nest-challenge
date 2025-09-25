import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserLeanDocument } from './users.schema';
import { Model } from 'mongoose';
import { RegisterUserDto } from '@lib/common';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(createUserDto: RegisterUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async findAll(): Promise<UserLeanDocument[]> {
    /** Mongoose's TypeScript support for lean() is weak, thus causing errors.
     *  Therefore, we use "as any". Nevertheless, "UserLeanDocument"
     *  can still provide clarity for what's happening.
     */
    return this.userModel.find().lean().exec() as any;
  }
}
