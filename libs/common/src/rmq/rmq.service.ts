import { Injectable } from "@nestjs/common";
import { RmqContext, RmqOptions, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RmqService {
  constructor(private readonly config: ConfigService) {
  }

  getOptions(queue: string, noAck = false, durable = true): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [
          this.config.get<string>("RABBIT_MQ_URL")
        ],
        queue: `RABBIT_MQ_${queue}_QUEUE`,
        queueOptions: { durable },
        persistent: true,
        noAck
      }
    };
  }

  ack(ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const msg = ctx.getMessage();
    channel.ack(msg);
  }
}
