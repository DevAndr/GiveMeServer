import { Module } from '@nestjs/common';
import { WishListController } from './wish-list.controller';
import { WishListService } from './wish-list.service';
import { WishListResolver } from './wish-list.resolver';

@Module({
  controllers: [WishListController],
  providers: [WishListService, WishListResolver]
})
export class WishListModule {

}
