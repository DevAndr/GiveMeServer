import { Body, Controller, Get, Inject, Logger, Post } from "@nestjs/common";
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from "@nestjs/microservices";
import { ParserService } from "./parser.service";
import {
  OZON_PARSER_EVENT,
  PARSER_SERVICE,
  WB_PARSER_EVENT,
} from "libs/common/constants";
import { DownloaderService } from "./DownloaderService";

@Controller("parser")
export class ParserController {
  private readonly logger = new Logger(ParserController.name);

  constructor(
    private readonly parserService: ParserService,
    @Inject(PARSER_SERVICE) private readonly parsedClient: ClientProxy,
    private readonly downloader: DownloaderService
  ) {}

  @MessagePattern(OZON_PARSER_EVENT)
  async onParseOzon(@Payload() data, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    const { link } = data?.product;

    if (link) {
      this.logger.log(`${link}`, "onParseOzon");
      const parsedData = await this.parserService.parseOzonPage(link);

      if (parsedData.img && parsedData.price && parsedData.name) {
        channel.ack(msg);
        this.parsedClient.emit("PARSED_DATA", {
          ...data?.product,
          ...parsedData,
          marketPlace: "OZON",
          status: "ACTIVE",
        });
        this.logger.log(parsedData);
      }
    }
  }

  @MessagePattern(WB_PARSER_EVENT)
  async onParseWB(@Payload() data, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();
    const { link } = data;

    console.log("parse wb", link, msg);

    if (link) {
      this.logger.log(`${link}`, "onParseWB");
      const parsedData = await this.parserService.parseWBPage(link);
      if (parsedData.img && parsedData.price && parsedData.name) {
        channel.ack(msg);
        this.parsedClient.emit("PARSED_DATA", {
          ...data,
          ...parsedData,
          marketPlace: "WB",
          status: "ACTIVE",
        });
        this.logger.log(parsedData);
      }
    }
  }

  @Get("test")
  async parseTest() {
    const parseData = await this.parserService.parseOzonPage(
      "https://www.ozon.ru/product/samsung-naushniki-besprovodnye-s-mikrofonom-samsung-galaxy-buds-2-pro-bluetooth-usb-type-c-1480318404/?asb=jrJwth8f36umHDE2tiKB%252FBp%252FHzjqWXFi9a8drMF7IEc%253D&asb2=u65--P2tnBAg29kRZE0HWEjLFcNDI26iHZKzARAYf5OKFASOJF89AXpd8-kAyHTODUEqvt0OIfjmxIyZovqBHw&avtc=1&avte=2&avts=1713774337"
    );
    return parseData;
  }
}
