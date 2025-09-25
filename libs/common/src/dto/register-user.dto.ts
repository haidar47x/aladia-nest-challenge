import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: "User's full name",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'test@example.com',
    description: "User's email address",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'YS2B7444#PASS',
    description: "User's password (min 8 characters)",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
