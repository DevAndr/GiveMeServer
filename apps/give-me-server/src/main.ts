import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { Transport } from "@nestjs/microservices";
import * as cookieParser from "cookie-parser";
import { RmqService } from "@app/common";
import { ConfigService } from "@nestjs/config";
import { NOTIFICATION_SERVICE, PARSER_SERVICE } from "libs/common/constants";

async function run() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(
    { origin: true, credentials: true }
  );

  const config = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }
  });

  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getOptions(PARSER_SERVICE));
  app.connectMicroservice(rmqService.getOptions(NOTIFICATION_SERVICE));  

  await app.startAllMicroservices();
  await app.listen(process.env.PORT);
}

run();
