import { Module } from '@nestjs/common';
import { RmqtModule } from "@app/common";
import { ParserController } from './parser.controller';
import { ParserService } from "./parser.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PARSER_SERVICE } from "./constants";

@Module({
  imports: [
    // RmqtModule.register({name: "PARSED_STREAM"})
    ClientsModule.register([
      {
        name: 'PARSED_STREAM',
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://guest:guest@localhost:5672"],
          queue: `PARSED_DATA_QUEUE`,
          queueOptions: {
            durable: true
          },
        }
      }
    ])
  ],
  controllers: [ParserController],
  providers: [ParserService],
})
export class ParserModule {}
