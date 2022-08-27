import { Resolver, Query, Mutation, Args, Context, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { GraphqlAccess, Public } from '../common/decorators';
import { GqlAuthGuard } from '../common/decorators/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { AtGuard, RtGuard } from '../common/decorators/guards';
import { WishList, User } from '../graphql';
import { WishListService } from '../wish-list/wish-list.service';


// @Public()
//
// @GraphqlAccess()
// @UseGuards(GqlAuthGuard)
@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly wishListService: WishListService) {}

  // @UseGuards(GqlAuthGuard)
  // @GraphqlAccess()
  @Query(returns => [User], {name: 'users'})
  findAll() {
    return this.userService.getUsers({});
  }

  @Query('user')
  findOne(@Args('uid') uid: string, @Context() ctx) {
    console.log(ctx);
    return this.userService.findUser({ uid: uid });
  }

  @ResolveField(() => [WishList])
  async wishLists(@Parent() user: User) {
    const { uid } = user;
    return this.wishListService.getAll(uid);
  }

  @Mutation('findUser')
  findUser(@Args('uid') uid: string) {
    const user = this.userService.getUser({uid: "9b9aa998-f961-4d3f-ad20-8b37f885f406"})
    console.log('findUser', user);
    return this.userService.findUser({ uid: uid });
  }
}
