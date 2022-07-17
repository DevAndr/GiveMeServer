import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../common/decorators';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { MoveProductDto } from './dto/move-product.dto';
import { RemoveProductDto } from './dto/remove-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('add')
  @Public()
  getAll(@Body() createProduct: CreateProductDto) {
    return this.productService.create(createProduct)
  }

  @Post('move')
  @Public()
  addToList(@Body() moveProduct: MoveProductDto) {
    return this.productService.addToList(moveProduct)
  }

  @Post('remove')
  @Public()
  remove(@Body("uid") uid: string) {
    return this.productService.remove(uid)
  }

  @Post('remove-by-ids')
  @Public()
  removeByIds(@Body() uids: string[]) {
    return this.productService.removeByUIDs(uids)
  }

  @Post('remove-all-by-list')
  @Public()
  removeAllByList(@Body() removeProduct: RemoveProductDto) {
    return this.productService.removeAllByList(removeProduct)
  }
}
