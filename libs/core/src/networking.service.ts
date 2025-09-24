import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class NetworkingService implements OnModuleInit {
  public authClient: ClientProxy;

  onModuleInit(): any {
    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',

        /** Authentication microservice is listening on 3001 */
        port: 3001,
      },
    });
  }
}
