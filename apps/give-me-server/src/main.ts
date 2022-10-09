import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { RmqtService } from "@app/common";
import { PARSER_SERVICE } from "../../parser/src/constants";

async function run() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors(
    { origin: true, credentials: true }
  );

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });



  // const rmqtService = app.get<RmqtService>(RmqtService)
  // app.connectMicroservice(rmqtService.getOptions(PARSER_SERVICE))

  app.useGlobalPipes(new ValidationPipe());
  // const reflector = new Reflector()
  // app.useGlobalGuards(new AtGuard(reflector));
  await app.startAllMicroservices()
  await app.listen(3030);
}

run();
