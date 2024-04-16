import { Body, Controller, Get, Inject, Logger, Post } from "@nestjs/common";
import { ClientProxy, Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { ParserService } from "./parser.service";
import { OZON_PARSER_EVENT, PARSER_SERVICE, WB_PARSER_EVENT } from "libs/common/constants";

@Controller("parser")
export class ParserController {
  private readonly logger = new Logger(ParserController.name);
  constructor(private readonly parserService: ParserService, @Inject(PARSER_SERVICE) private readonly parsedClient: ClientProxy) {}

  @MessagePattern(OZON_PARSER_EVENT)
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

  @MessagePattern(WB_PARSER_EVENT)
  async onParseWB(@Payload() data, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    const {link} = data?.product

    console.log('parse wb', link, msg);
    

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

  @Get('test')
  async parseTest() {
    const parsedData = await this.parserService.parseWBPage('https://www.wildberries.ru/catalog/63846890/detail.aspx')
    return parsedData
  }
}
