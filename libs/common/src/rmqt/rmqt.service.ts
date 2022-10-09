import { Injectable } from "@nestjs/common";
import { RmqOptions, Transport } from "@nestjs/microservices";

@Injectable()
export class RmqtService {

  getOptions(queue: string, noAck = false):RmqOptions {

    return {
      transport: Transport.RMQ,
      options: {
        urls: [
          'amqp://guest:guest@localhost:5672'
        ],
        queue: `RABBIT_MQ_${queue}_QUEUE`,
        noAck
      }
    }
  }
}
