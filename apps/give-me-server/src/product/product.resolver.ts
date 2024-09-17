import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProductService } from "./product.service";
import { GetCurrentUserId, Public } from "../common/decorators";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PARSER_SERVICE } from "libs/common/constants";
import { MarketType } from "../schema/graphql";

@Resolver("product")
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    @Inject(PARSER_SERVICE) private readonly parserClient: ClientProxy
  ) {}

  @Public()
  @Query("productsWishList")
  async productsWishList(@Args("idWishList") idWishList: string) {
    return await this.productService.productsWishList(idWishList);
  }

  @Public()
  @Query("productsWishListPublic")
  async productsWishListPublic(@Args("idWishList") idWishList: string) {
    return await this.productService.productsWishListPublic(idWishList);
  }

  @Mutation("updateProduct")
  async updateProduct(
    @Args("data") product: UpdateProductDto,
    @GetCurrentUserId() id: string
  ) {
    console.log("updateProduct", product);
    return await this.productService.update(product);
  }

  @Public()
  @Mutation("addToList")
  async addToList(
    @Args("data") productDto: CreateProductDto,
    @GetCurrentUserId() id: string
  ) {
    const product = {
      ...productDto,
      img: "",
      royalties: 0,
      price: 0,
      delivery: 0,
    };

    const createdProduct = await this.productService.create(product);

    if (createdProduct.marketPlace === MarketType.OZON)
      await this.parserClient.emit(`PARSE_${MarketType.OZON}`, {
        ...createdProduct,
      });

    if (createdProduct.marketPlace === MarketType.WB)
      await this.parserClient.emit(`PARSE_${MarketType.WB}`, {
        ...createdProduct,
      });

    // this.parserClientTCP.emit<string, any>('PARSE_DATA_FOR_PRODUCT', { product, fromUser: uid })
    // this.parserClient.emit('PARSE_DATA_FOR_PRODUCT', { product, fromUser: uid })

    return createdProduct;
  }

  @Mutation("removeProducts")
  async removeProducts(
    @Args("products") products: string[],
    @GetCurrentUserId() id: string
  ) {
    await this.productService.removeByUIDs(products);
  }

  @Public()
  @Query("testProductQuery")
  testQuery() {
    return "test";
  }
}
