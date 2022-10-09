import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ParserModule } from "./parser.module";
import { PARSER_SERVICE } from "./constants";
import { RmqtService } from "@app/common";
import { ValidationPipe } from "@nestjs/common";


async function bootstrap() {
  const port = process.env.PORT ? Number(process.env.PORT) : 3031;
  console.log(port);

  // const app = await NestFactory.createMicroservice(ParserModule, {
  //   transport: Transport.TCP,
  //   port
  // });
  // const rmqtService = app.get<RmqtService>(RmqtService)
  // app.useGlobalPipes(new ValidationPipe())

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ParserModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: `RABBIT_MQ_${PARSER_SERVICE}_QUEUE`,
      noAck: false,
      queueOptions: {
        durable: true
      },
    },
    logger: console,
  });

  console.log('microservice parser start');

  await app.listen();
}

bootstrap();
