import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderResolver } from "./order.resolver"; 

@Module({
  imports: [],
  controllers: [],
  providers: [OrderService, OrderResolver],
})
export class OrderModule {}
