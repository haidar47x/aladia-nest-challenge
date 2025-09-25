import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TokenRto {
  @ApiProperty({
    example:
      'eyJhbIpXVCJ9.eyJpc36M5Nn0.CA7eaHjIHz5NxeIJoFK9krqaeZrPLwmMmgI_XiQiIkQ',
    description: 'Access token for accessing protected endpoints',
  })
  @Expose()
  token: string;
}
