import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserRto {
  @ApiProperty({
    example: '632f2a7e4e9b8b4f2c8f0a1b',
    description: 'The unique identifier of the user (MongoDB ObjectId)',
  })
  @Expose()
  _id: string;

  @ApiProperty({
    example: 'John Doe',
    description: "The user's full name",
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: "The user's email address",
  })
  @Expose()
  email: string;

  @Exclude()
  passwordHash?: string;
}
