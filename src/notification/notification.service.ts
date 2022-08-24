import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationService {

  constructor(@Inject('NOTIFICATIONS') private readonly clientNotification: ClientProxy,
              @Inject('REDIS') private readonly clientRedis: ClientProxy) {
  }

  // constructor(private readonly client: ClientProxy) {
  //   this.client = ClientProxyFactory.create(
  //     {
  //       transport: Transport.REDIS,
  //       options: {
  //         host: 'localhost',
  //         port: 6379,
  //       },
  //     },
  //   );
  // }


  send(msg: string) {
    this.clientNotification.emit('new_notify', msg);
    this.clientRedis.emit('notify', msg)
  }

  readNotify(msg: string) {
    // this.clientMessages.emit('read_notify', msg)
    // this.clientNotification.emit('new_notify', msg);
      this.clientRedis.send('notify', msg)
    console.log('readNotify', msg);
  }
}
