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
    // ClientsModule.register([
    //   {
    //     name: "PARSER-MICROSERVICE",
    //     transport: Transport.TCP
    //   },
    // ]),
    RmqModule.register({name: PARSER_SERVICE}),
    // ClientsModule.register([
    //   {
    //     name: PARSER_SERVICE,
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ["amqp://guest:guest@localhost:5672"],
    //       queue: `RABBIT_MQ_${PARSER_SERVICE}_QUEUE`,
    //       queueOptions: {
    //         durable: true
    //       },
    //     }
    //   }
    // ]),
    // ClientsModule.register([
    //   {
    //     name: 'PARSED_STREAM',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ["amqp://guest:guest@localhost:5672"],
    //       queue: `RABBIT_MQ_${PARSER_SERVICE}_QUEUE`,
    //       queueOptions: {
    //         durable: true
    //       },
    //     }
    //   }
    // ]),
    // ClientsModule.register([
    //   {
    //     name: 'PARSED',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ["amqp://guest:guest@localhost:5672"],
    //       queue: `RABBIT_MQ_${'PARSED_STREAM'}_QUEUE`,
    //       queueOptions: {
    //         durable: true
    //       },
    //     }
    //   }
    // ])

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