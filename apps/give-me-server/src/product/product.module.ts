import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { ProductResolver } from "./product.resolver";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RmqModule } from "@app/common"; 
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { ParsedEventService } from "./parsed.event.service";
import { PARSER_SERVICE } from "libs/common/constants";

@Module({
  imports: [ 
    RmqModule.register({name: PARSER_SERVICE}), 

    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'exchange1',
          type: 'topic',
        },
      ],
      uri: 'amqp://guest:guest@localhost:6380',
      connectionInitOptions: { wait: false },
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductResolver, ParsedEventService]
})
export class ProductModule {

}