import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { WishListService } from '../wish-list/wish-list.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserResolver, WishListService],
  exports: [UserService]
})
export class UserModule {

}
