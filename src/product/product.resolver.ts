import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { ProductService } from "./product.service";
import { GetCurrentUserId } from "../common/decorators";
import { CreateProductDto } from "./dto/create-product.dto";
import { IProduct } from "./types";
import { Product } from "src/graphql";

@Resolver("product")
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  // @Mutation('create')
  // create(){
  //
  // }

  @Mutation('addToList')
  async addToList(@Args('data') productDto: CreateProductDto, @GetCurrentUserId() uid: string) {
    console.log('addToList', uid, productDto);

    return productDto
  }
}
