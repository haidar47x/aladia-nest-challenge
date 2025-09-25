import { Module } from '@nestjs/common';
import { CoreModule } from '@lib/core';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from '@lib/logger';
import { HealthModule } from './health/health.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CoreModule,
    AuthModule,
    LoggerModule,
    HealthModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL', 60),
          limit: configService.get<number>('THROTTLE_LIMIT', 10),
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class GatewayModule {}
