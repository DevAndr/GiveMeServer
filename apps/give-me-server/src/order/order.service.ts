import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  Prisma,
  StatusOrder,
  StatusTransaction,
  TypePayment,
} from "@prisma/client";
import { CreateOrderInput, UpdateInput } from "../schema/graphql";

@Injectable()
export class OrderService {
  PERCENT_FEE = 0.05;
  constructor(private readonly prismaService: PrismaService) {}

  async getOrder(where: Prisma.OrderWhereUniqueInput) {
    return await this.prismaService.order.findUnique({
      where,
      include: {
        products: true,
      }
    });
  }

  async createOrder(data: CreateOrderInput) {
    let price = 0;
    let feePercentPrice = this.PERCENT_FEE;

    const rates = await this.prismaService.rates.findFirst({});

    if (rates) {
      feePercentPrice = rates.feePercentPrice;
    }

    const products = await this.prismaService.product.findMany({
      where: {
        id: {
          in: data.productIds,
        },
      },
    });

    products.forEach((product) => {
      price += product.price * feePercentPrice + product.price;
    });

    console.log(price);

    return this.prismaService.order.create({
      data: {
        name: "",
        price: Math.round(price),
        description: "",
        status: StatusOrder.OPEN,
        products: {
          connect: products.map((product) => ({ id: product.id })),
        },
      },
      include: {
        products: true,
      },
    });
  }

  async pathOrder(data: UpdateInput) {
    const { id, ...otherData } = data;

    if (!id) {
      console.log("createOrder");

      return this.createOrder({ ...otherData, name: otherData.name });
    } else {
      const { productIds, ...otherData } = data;
      let price = 0;
      let feePercentPrice = this.PERCENT_FEE;

      const rates = await this.prismaService.rates.findFirst({});

      if (rates) {
        feePercentPrice = rates.feePercentPrice;
      }

      const products = await this.prismaService.product.findMany({
        where: {
          id: {
            in: data.productIds,
          },
        },
      });

      products.forEach((product) => {
        price += product.price * feePercentPrice + product.price;
      });

      console.log("path Order", productIds);

      return await this.prismaService.order.update({
        where: {
          id,
        },
        data: {
          ...otherData,
          price: Math.round(price),
          products: {
            connect: productIds.map((id) => ({ id })),
          },
        },
        include: {
          products: true,
        },
      });
    }
  }

  async payOrder(id: string) {
    return await this.prismaService.order.update({
      where: {
        id,
      },
      data: {},
    });
  }
}
