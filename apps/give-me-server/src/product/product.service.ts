import { Injectable } from "@nestjs/common";
import { Product } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { MoveProductDto } from "./dto/move-product.dto";
import { RemoveProductDto } from "./dto/remove-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { StatusOrder } from "../schema/graphql";

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {
  }

  add() {

  }

  async productsWishList(idWishList: string): Promise<Product[]> {
    return this.prismaService.product.findMany(
      {
        where: {
          idWishList
        }
      }
    );
  }

  async addToList(moveProduct: MoveProductDto) {
    const { id, idSender, idWishList } = moveProduct;

    return this.prismaService.product.update({
      where: {
        id
      },
      data: {
        idWishList
      },
      include: {
        wishList: true
      }
    });
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
    const { idWishList, ...otherData } = product;
    const foundWishList = await this.prismaService.wishList.findUnique({
      where: {
        id: idWishList
      }
    });

    return this.prismaService.product.create({
      data: {
        ...otherData,
        price: 0,
        status: 'VALIDATION',
        likes: 0,
        disLikes: 0,
        royalties: 0,
        delivery: 0,
        img: "",
        wishList: {
          connect: {
            id: foundWishList.id
          }
        }
      }
    });
  }

  async update(updateProduct: UpdateProductDto): Promise<Product> {
    console.log("updateProduct", updateProduct);
    
    const { id } = updateProduct;
    return this.prismaService.product.update({
      where: { id },
      data: { ...updateProduct }
    });
  }

  async remove(id: string): Promise<Product | null> {
    return this.prismaService.product.delete({
      where: {
        id
      }
    });
  }

  async removeByUIDs(ids: string[]) {
    // @ts-ignore
    await this.prismaService.product.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });
  }


  async removeAllByList(removeProduct: RemoveProductDto): Promise<any> {
    return await this.prismaService.product.deleteMany({
      where: {
        idWishList: removeProduct.idWishList
      }
    });
  }
}
