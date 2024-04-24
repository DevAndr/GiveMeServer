import {Resolver, Query, Mutation, Args, Context, ResolveField, Parent} from '@nestjs/graphql';
import {UserService} from './user.service';
import {WishList, User, UpdateUserInput} from '../schema/graphql';
import {WishListService} from '../wish-list/wish-list.service';
import {GetCurrentUserId, Public} from "../common/decorators"; 


// @Public()
//
// @GraphqlAccess()
// @UseGuards(GqlAuthGuard)
@Resolver(of => User)
export class UserResolver {
    constructor(private readonly userService: UserService, private readonly wishListService: WishListService) {
    }

    // @UseGuards(GqlAuthGuard)
    // @GraphqlAccess()
    @Query(returns => [User], {name: 'users'})
    findAll() {
        return this.userService.getUsers({});
    }

    @Public()
    @Query('user')
    findOne(@Args('id') id: string, @Context() ctx) {
        console.log(ctx);
        return this.userService.findUser({id});
    }

    @ResolveField(() => [WishList])
    async wishLists(@Parent() user: User) {
        const {id} = user;
        return this.wishListService.getAll(id);
    }

    @Mutation('findUser')
    findUser(@Args('id') id: string) {
        const user = this.userService.getUser({id: "9b9aa998-f961-4d3f-ad20-8b37f885f406"})
        console.log('findUser', user);
        return this.userService.findUser({id});
    }

    @Query('currentUser')
    currentUser(@GetCurrentUserId() id: string, @Context() ctx) {
        return this.userService.findUser({id});
    }

    @Mutation('updateUser')
    updateUser(@Args('id') id: string, @Args('params') params: UpdateUserInput) {
        return this.userService.updateUser({data: params, where: {id}});
    }
}
