import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProductService } from "./product.service";
import { GetCurrentUserId, Public } from "../common/decorators";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Inject } from "@nestjs/common"; 
import { ClientProxy } from "@nestjs/microservices";
import { MarketType } from "../../../../src/graphql";
import { PARSER_SERVICE } from "libs/common/constants";

@Resolver("product")
export class ProductResolver {
  constructor(private readonly productService: ProductService,
              @Inject(PARSER_SERVICE) private readonly parserClient: ClientProxy) {}

  @Query("productsWishList")
  async productsWishList(@Args("uidWishList") uidWishList: string) {
    return await this.productService.productsWishList(uidWishList);
  }

  @Mutation("updateProduct")
  async updateProduct(@Args("data") product: UpdateProductDto, @GetCurrentUserId() uid: string) {
    console.log("updateProduct", product);
    return await this.productService.update(product);
  }

  @Public()
  @Mutation("addToList")
  async addToList(@Args("data") productDto: CreateProductDto, @GetCurrentUserId() uid: string) {
    const product = {
      ...productDto,
      img: "",
      royalties: 0,
      price: 0,
      delivery: 0,
      status: "VALIDATION"
    };

    const createdProduct = await this.productService.create(product);

    if (createdProduct.marketPlace === MarketType.OZON)
      await this.parserClient.emit(`PARSE_${MarketType.OZON}`, { product: { ...createdProduct }, uidUser: uid });

    if (createdProduct.marketPlace === MarketType.WB)
      await this.parserClient.emit(`PARSE_${MarketType.WB}`, { product: { ...createdProduct }, uidUser: uid });

    // this.parserClientTCP.emit<string, any>('PARSE_DATA_FOR_PRODUCT', { product, fromUser: uid })
    // this.parserClient.emit('PARSE_DATA_FOR_PRODUCT', { product, fromUser: uid })

    return createdProduct;
  }

  @Mutation("removeProducts")
  async removeProducts(@Args("products") products: string[], @GetCurrentUserId() uid: string) {
    await this.productService.removeByUIDs(products);
  }
}
