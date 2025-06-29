import { Module } from "@nestjs/common";
import { WishListController } from "./wish-list.controller";
import { WishListService } from "./wish-list.service";
import { WishListResolver } from "./wish-list.resolver";
import { PubSub } from "graphql-subscriptions";

@Module({
  controllers: [WishListController],
  providers: [
    WishListService,
    WishListResolver,
    {
      provide: "PUB_SUB",
      useValue: new PubSub(),
    },
  ],
})
export class WishListModule {}
