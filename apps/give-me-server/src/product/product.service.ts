import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { MoveProductDto } from './dto/move-product.dto';
import { RemoveProductDto } from './dto/remove-product.dto';
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {
  }

  add() {

  }

  async productsWishList(uidWishList: string): Promise<Product[]> {
    return await this.prismaService.product.findMany(
      {
        where: {
          uidWishList
        }
      }
    )
  }

  async addToList(moveProduct: MoveProductDto) {
    const {uid, uidReceiver, uidWishList} = moveProduct

    return await this.prismaService.product.update({
      where: {
        uid
      },
      data: {
        uidWishList
      },
      include: {
        wishList: true
      }
    })
  }


  // async createProductForList(createProductDto: CreateProductDto) {
  //   const { uidWishList} = createProductDto
  //
  //   if (uidWishList)
  //     return await this.prismaService.product.create({
  //       data: {
  //         ...createProductDto
  //       },
  //
  //     })
  //
  //   return await this.prismaService.product.create({
  //     data: {
  //       ...createProductDto
  //     },
  //   })
  // }

  async create(product: CreateProductDto): Promise<Product | null> {
    return await this.prismaService.product.create({
      // @ts-ignore
      data: {
        ...product
      }
    })
  }

  async update(updateProduct: UpdateProductDto): Promise<Product> {
    const { uid } = updateProduct
    return await this.prismaService.product.update({
      where: {uid},
      data: {...updateProduct}
    })
  }

  async remove(uid: string): Promise<Product | null> {
    return await this.prismaService.product.delete({
      where: {
        uid
      }
    })
  }

  async removeByUIDs(uids: string[]){
    // @ts-ignore
    await this.prismaService.product.deleteMany({
      where: {
        uid: {
          in: uids
        }
      }
    })
  }



  async removeAllByList(removeProduct: RemoveProductDto): Promise<any> {
    return await this.prismaService.product.deleteMany({
      where: {
        uidWishList: removeProduct.uidWishList
      },
    })
  }
}
