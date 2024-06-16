import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, WishList } from "@prisma/client";
import { CreateWishListDto } from "./dto/create-wish-list.dto";
import { DeleteWishListDto } from "./dto/delete-wish-list.dto";
import { UpdateWishListDto } from "./dto/update-wish-list.dto";

@Injectable()
export class WishListService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async getAll(idUser: string): Promise<any> {
    return this.prismaService.wishList.findMany({
      where: {
        idUser
      },
      include: {
        user: true,
        products: true
      }
    });
  }

  async getListById(id: string): Promise<WishList | null> {
    return this.prismaService.wishList.findUnique({
      where: {
        id
      },
      include: {
        products: true
      }
    });
  }

  async getListByIdForUser(where: Prisma.WishListIdUserIdCompoundUniqueInput): Promise<WishList | null> {
    return this.prismaService.wishList.findFirst({
      where,
      include: {
        products: true
      }
    });
  }

  async addList(createWishListDto: CreateWishListDto): Promise<WishList | null> {
    return this.prismaService.wishList.create({
      data: {
        ...createWishListDto
      }
    });
  }

  async updateList(updateWishListDto: UpdateWishListDto): Promise<any> {
    const { id, idUser } = updateWishListDto;
    console.log(idUser, updateWishListDto);

    return this.prismaService.wishList.update({
      where: {
        id
      },
      data: {
        ...updateWishListDto
      }
    });
  }

  async removeById(deleteWishListDto: DeleteWishListDto): Promise<any> {
    const { idUser, id } = deleteWishListDto;
    console.log(idUser);
    return this.prismaService.wishList.delete({
      where: {
        idUser_id: deleteWishListDto
      },
      include: {
        products: true
      }
    });
  }

  async removeAll(idUser: string): Promise<any> {
    return this.prismaService.wishList.deleteMany({
      where: {
        idUser
      }
    });
  }
}
