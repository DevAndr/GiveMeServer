import { Module } from '@nestjs/common';
import { SenderService } from './sender.service';
import { SenderResolver } from './sender.resolver';

@Module({
  providers: [SenderService, SenderResolver]
})
export class SenderModule {}
