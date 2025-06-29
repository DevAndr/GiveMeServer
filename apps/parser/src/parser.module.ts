import { Module } from '@nestjs/common';
import { ParserController } from './parser.controller';
import { ParserService } from "./parser.service";
import { RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { PARSER_SERVICE } from 'libs/common/constants';
import { DownloaderService } from "./DownloaderService";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/parser/.env'
    }),
    RmqModule.register({name: PARSER_SERVICE}),
  ],
  controllers: [ParserController],
  providers: [ParserService, DownloaderService],
})
export class ParserModule {}
