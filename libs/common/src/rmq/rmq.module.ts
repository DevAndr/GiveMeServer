import { DynamicModule, Module } from "@nestjs/common";
import { RmqService } from "@app/common/rmq/rmq.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

interface IRmqModuleOptions {
  name: string;
}

@Module({
  providers: [RmqService],
  exports: [RmqService]
})
export class RmqModule {

  static register({ name }: IRmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([{
          name,
          useFactory: (config: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [config.get<string>('RABBIT_MQ_URL')],
              queue: `RABBIT_MQ_${name}_QUEUE`, 
            }
          }),
          inject: [ConfigService]
        }])
      ], exports: [ClientsModule]
    };
  }
}
