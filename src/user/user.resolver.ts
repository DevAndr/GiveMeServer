import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { GraphqlAccess, Public } from '../common/decorators';
import { GqlAuthGuard } from '../common/decorators/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { AtGuard, RtGuard } from '../common/decorators/guards';


// @UseGuards(GqlAuthGuard)
// @Public()
@GraphqlAccess()

@Resolver('user-gql')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('users')
  findAll() {
    return this.userService.getUsers({});
  }

  @Query('user')
  findOne(@Args('uid') uid: string, @Context() ctx) {
    console.log(ctx);
    return this.userService.findUser({ uid: uid });
  }

  @Mutation('findUser')
  findUser(@Args('uid') uid: string) {
    const user = this.userService.getUser({uid: "9b9aa998-f961-4d3f-ad20-8b37f885f406"})
    console.log('findUser', user);
    return this.userService.findUser({ uid: uid });
  }
}
