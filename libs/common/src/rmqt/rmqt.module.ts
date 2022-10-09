import { DynamicModule, Module } from "@nestjs/common";
import { RmqtService } from "@app/common/rmqt/rmqt.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

interface IRmqtModuleOptions {
  name: string;
}

@Module({
  providers: [RmqtService],
  exports: [RmqtService]
})
export class RmqtModule {

  static register({ name }: IRmqtModuleOptions): DynamicModule {
    return {
      module: RmqtModule,
      imports: [
        ClientsModule.registerAsync([{
          name,
          useFactory: (config: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: ["amqp://guest:guest@localhost:5672"],
              queue: `RABBIT_MQ_${name}_QUEUE`,
              queueOptions: {
                durable: true
              },
            }
          })
        }])
      ], exports: [ClientsModule]
    };
  }
}
