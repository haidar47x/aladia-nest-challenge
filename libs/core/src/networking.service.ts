import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  TcpClientOptions,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class NetworkingService implements OnModuleInit {
  public authClient!: ClientProxy;

  getAuthServiceOptions(): TcpClientOptions['options'] {
    return {
      host: process.env.AUTH_SERVICE_HOST || '127.0.0.1',
      port: +(process.env.AUTH_SERVICE_PORT || 3001),
    };
  }

  onModuleInit() {
    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: this.getAuthServiceOptions(),
    });
  }
}
