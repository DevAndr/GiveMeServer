import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { OrderService } from "./order.service";
import { CreateOrderInput, UpdateInput } from "../schema/graphql";
import { Public } from "../common/decorators";

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}
  
  @Public()
  @Query("getOrder")
  getOrder(@Args("id") id: string) {
    return this.orderService.getOrder({ id });
  }

  @Mutation("createOrder")
  createOrder(@Args("data") data: CreateOrderInput) {
    return this.orderService.createOrder(data);
  }

  @Public()
  @Mutation("pathOrder")
  pathOrder(@Args("data") data: UpdateInput) {
    return this.orderService.pathOrder(data);
  }
}
