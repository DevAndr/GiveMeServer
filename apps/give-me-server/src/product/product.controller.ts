import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { Public } from "../common/decorators";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { MoveProductDto } from "./dto/move-product.dto";
import { RemoveProductDto } from "./dto/remove-product.dto"; 
import { ClientProxy, Ctx, EventPattern, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { PARSER_SERVICE } from "libs/common/constants";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService,
              private readonly amqpConnection: AmqpConnection,
              @Inject(PARSER_SERVICE) private readonly parserClient: ClientProxy
  ) {}

 
  @Post("move")
  @Public()
  addToList(@Body() moveProduct: MoveProductDto) {
    return this.productService.addToList(moveProduct);
  }

  @Post("remove")
  @Public()
  remove(@Body("id") id: string) {
    return this.productService.remove(id);
  }

  @Post("remove-by-ids")
  @Public()
  removeByIds(@Body() ids: string[]) {
    return this.productService.removeByUIDs(ids);
  }

  @Post("remove-all-by-list")
  @Public()
  removeAllByList(@Body() removeProduct: RemoveProductDto) {
    return this.productService.removeAllByList(removeProduct);
  }

  @Get('test')
  @Public()
  test() {
    // this.amqpConnection.publish('exchange1', 'subscribe-queue', { msg: 'hello world' });

    // this.parserClientTCP.emit("PARSE_DATA_FOR_PRODUCT", { product: {}, fromUser: "TCP" });
    this.parserClient.emit('PARSE_OZON', { product: {link: 'https://www.ozon.ru/product/konstruktor-wange-superkar-sportivnyy-avtomobil-seryy-legosovmestimyy-200-detaley-69928-562514150/?asb=d5qDFbHFmh06uUHGKWLiTQxKE3niE8dm5Iu36vPd6zW2XcX2xSifufHrPwpQnAoE&asb2=etzSn5yAUwbsD1_fyCfoXyR_soD5y-B1XwjNcKRV_7PvWP6bhtPBzEpYUaN0kgGDjaDwp25LQrNvAAap1nGMramyAG7bCUwN3aWH4OTtLLmwE34PECFMMicXdhu8NSwkMrbv4GXfIEPXD_IhWei-Jg&sh=wcPdZ_wcGQ'}, fromUser: "OZON" })
    // this.parserClient.emit('PARSE_WB', { product: {}, fromUser: "WB" })
    return {};
  }

  @MessagePattern("PARSED_DATA")
  onParsed(@Payload() data, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    channel.ack(msg); 
    console.log("API - PARSED_DATA", data);
    this.productService.update(data);
  }

}
