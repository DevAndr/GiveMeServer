import { Args, Query, Resolver } from '@nestjs/graphql';
import { WishListService } from './wish-list.service';

@Resolver('wish-list-gql')
export class WishListResolver {
  constructor(private readonly wishListService: WishListService) {}

  // @Public()
  @Query('wishListForUser')
  wishListForUser(@Args("uidUser") uidUser: string) {
    return this.wishListService.getAll(uidUser)
  }
}