import {Resolver, Query, Mutation, Args, Context, ResolveField, Parent} from '@nestjs/graphql';
import {UserService} from './user.service';
import {WishList, User, CreateUserInput} from '../schema/graphql';
import {WishListService} from '../wish-list/wish-list.service';
import {GetCurrentUserId, Public} from "../common/decorators";
import {UpdateUserInput} from "../../../../src/schema/graphql";


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
    findOne(@Args('uid') uid: string, @Context() ctx) {
        console.log(ctx);
        return this.userService.findUser({uid: uid});
    }

    @ResolveField(() => [WishList])
    async wishLists(@Parent() user: User) {
        const {uid} = user;
        return this.wishListService.getAll(uid);
    }

    @Mutation('findUser')
    findUser(@Args('uid') uid: string) {
        const user = this.userService.getUser({uid: "9b9aa998-f961-4d3f-ad20-8b37f885f406"})
        console.log('findUser', user);
        return this.userService.findUser({uid: uid});
    }

    @Query('currentUser')
    currentUser(@GetCurrentUserId() uid: string, @Context() ctx) {
        return this.userService.findUser({uid: uid});
    }

    @Mutation('updateUser')
    updateUser(@Args('uid') uid: string, @Args('params') params: UpdateUserInput) {
        return this.userService.updateUser({data: params, where: {uid}});
    }
}
