import { Injectable } from "@nestjs/common";
import {
  MessageHandlerErrorBehavior,
  RabbitPayload,
  RabbitRequest,
  RabbitRPC,
  RabbitSubscribe
} from "@golevelup/nestjs-rabbitmq";
import { Public } from "../common/decorators";
import { ProductService } from "./product.service";


@Injectable()
export class ParsedEventService {
  constructor(private readonly productService: ProductService,) {}

  @Public()
  @RabbitRPC({
    exchange: "exchange1",
    queue: "PARSED_DATA_QUEUE",
    errorBehavior: MessageHandlerErrorBehavior.REQUEUE
  })
  public async rpcHandler(@RabbitPayload() msg, @RabbitRequest() req) {
    const {parsedData, idUser} = msg.data
    if (parsedData.price && parsedData.img && parsedData.name) {
      await this.productService.update(parsedData)
    }

    console.log(`Event parsed: ${JSON.stringify(msg)}`);
  }


  // @Public()
  // @RabbitSubscribe({
  //   exchange: "exchange1",
  //   routingKey: "subscribe-queue",
  //   queue: "subscribe-queue"
  // })
  // public async parsed(msg: {}) {
  //   console.log(`Received rpc message: ${JSON.stringify(msg)}`);
  //   return false;
  //   // return { message: 'hi' };
  // }


  // @Public()
  // @RabbitSubscribe({
  //   exchange: 'exchange1',
  //   queue: 'PARSED_DATA_QUEUE',
  // })
  // public async parsed(msg: {}, d) {
  //   console.log(`parsed ${JSON.stringify(msg)}`);
  //
  //   // return { message: 'hi' };
  // }
}
