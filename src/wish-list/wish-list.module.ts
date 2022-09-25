import { Module } from '@nestjs/common';
import { WishListController } from './wish-list.controller';
import { WishListService } from './wish-list.service';
import { WishListResolver } from './wish-list.resolver';
import { PubSub } from "graphql-subscriptions";
import { AtWsStrategy } from "../auth/strategies/at.ws.strategy";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [WishListController],
  providers: [WishListService, WishListResolver, {
    provide: 'PUB_SUB',
    useValue: new PubSub(),
  }]
    // AtWsStrategy, ConfigService]

})
export class WishListModule {

}
