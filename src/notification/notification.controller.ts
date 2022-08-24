import { Body, Controller, Post } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { Public } from '../common/decorators';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {
  }

  @MessagePattern('notifications')
  getNotifications(@Payload() data: number[], @Ctx() context: RedisContext) {
    console.log(`Channel: ${context.getChannel()}`);
  }

  @Post('send')
  @Public()
  send(@Body() msg: string) {
    this.notificationService.send(msg)
  }

  @EventPattern('notify')
  handleReadNotify(data){
    this.notificationService.readNotify(data)
  }
}
