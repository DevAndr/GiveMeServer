import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ParserModule } from "./parser.module"; 
import { RmqService } from "@app/common";
import { ValidationPipe } from "@nestjs/common";
import { PARSER_SERVICE } from "libs/common/constants";


async function bootstrap() {
  const port = process.env.PORT ? Number(process.env.PORT) : 3031;
  console.log(port); 
  
  const app = await NestFactory.create(ParserModule)
  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getOptions(PARSER_SERVICE));
  await app.startAllMicroservices();

  await app.listen(port, () => {
    console.log('Parser listening on port', port);
  });
}

bootstrap();
