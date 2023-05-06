import { Body, Controller, Inject, Logger, Post } from "@nestjs/common";
import { ClientProxy, Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { ParserService } from "./parser.service";

@Controller("parser")
export class ParserController {
  private readonly logger = new Logger(ParserController.name);
  constructor(private readonly parserService: ParserService, @Inject("PARSED_STREAM") private readonly parsedClient: ClientProxy) {}

  @MessagePattern("PARSE_OZON")
  async onParseOzon(@Payload() data, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    const {link} = data?.product

    if (link) {
      this.logger.log(`${link}`, 'onParseOzon')
      const parsedData = await this.parserService.parseOzonPage(link)

      if (parsedData.img && parsedData.price && parsedData.name) {
        channel.ack(msg);
        this.parsedClient.emit("PARSED_DATA", {parsedData: {...data?.product,
            ...parsedData, marketPlace: "OZON", status: "ACTIVE" }, uidUser: data.uidUser});
        this.logger.log(parsedData)
      }
    }
  }

  @MessagePattern("PARSE_WB")
  async onParseWB(@Payload() data, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    const {link} = data?.product

    if (link) {
      this.logger.log(`${link}`, 'onParseWB')
      const parsedData = await this.parserService.parseWBPage(link)
      if (parsedData.img && parsedData.price && parsedData.name) {
        channel.ack(msg);
        this.parsedClient.emit("PARSED_DATA", {parsedData: {...data?.product,
            ...parsedData, marketPlace: "WB", status: "ACTIVE" }, uidUser: data.uidUser});
        this.logger.log(parsedData)
      }
    }
  }
}
