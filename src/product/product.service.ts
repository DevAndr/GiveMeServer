import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { MoveProductDto } from './dto/move-product.dto';
import { RemoveProductDto } from './dto/remove-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {
  }

  add() {

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

  async create(product: CreateProductDto): Promise<Product | null> {
    return await this.prismaService.product.create({
      // @ts-ignore
      data: {
        ...product
      }
    })
  }

  update() {

  }

  async remove(uid: string): Promise<Product | null> {
    return await this.prismaService.product.delete({
      where: {
        uid
      }
    })
  }

  async removeByUIDs(uids: string[]): Promise<any> {
    // @ts-ignore
    return await this.prismaService.product.deleteMany({
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
