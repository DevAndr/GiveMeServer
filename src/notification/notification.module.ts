import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATIONS',
        transport: Transport.TCP,
      },
      {
        transport: Transport.REDIS,
        name: 'REDIS',
        options: {
          host: 'localhost',
          port: 6379
        }
      }
    ])
  ],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {}
