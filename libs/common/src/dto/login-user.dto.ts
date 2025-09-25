import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'test@example.com',
    description: "User's email address that was created during sign up",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'YS2B7444#PASS',
    description:
      "User's password that was created during sign up (min 8 characters)",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
