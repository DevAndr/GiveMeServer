import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, WishList } from '@prisma/client';
import { CreateWishListDto } from './dto/create-wish-list.dto';
import { DeleteWishListDto } from './dto/delete-wish-list.dto';

@Injectable()
export class WishListService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(uidUser: string): Promise<any> {
    return await this.prismaService.wishList.findMany({
      where: {
        uidUser
      },
      include: {
        user: true,
        products: true
      }
    });
  }

  async getListById(uid: string): Promise<WishList | null> {
    return await this.prismaService.wishList.findUnique({
      where: {
        uid,
      },
      include: {
        products: true
      }
    });
  }

  async addList(createWishListDto: CreateWishListDto): Promise<any> {
    await this.prismaService.wishList.create({
      data: {
        ...createWishListDto,
      },
    });
  }

  async removeById(deleteWishListDto: DeleteWishListDto): Promise<any> {
    const {uidUser, uid} = deleteWishListDto
    console.log(uidUser);
    return await this.prismaService.wishList.delete({
      where: {
        uid: deleteWishListDto.uid,
      },
      include: {
        products: true
      }
    });
  }

  async removeAll(uidUser: string): Promise<any> {
    return await this.prismaService.wishList.deleteMany({
      where: {
        uidUser,
      },
    });
  }
}
