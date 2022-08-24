import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function run() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });

  app.useGlobalPipes(new ValidationPipe());
  // const reflector = new Reflector()
  // app.useGlobalGuards(new AtGuard(reflector));
  await app.startAllMicroservices()
  await app.listen(3030);
}

run();
