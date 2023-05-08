import { Args, Context, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { WishListService } from "./wish-list.service";
import { GetCurrentUserId, Public } from "../common/decorators";
import { WishList } from "../schema/graphql";
import { PubSubEngine } from "graphql-subscriptions";
import { ExecutionContext, Inject, Req, UseGuards } from "@nestjs/common";
import { GqlContext } from "../app.module";
import { AtWsGuard } from "../common/decorators/guards/at.ws.guard";
import { WsArgumentsHost } from "@nestjs/common/interfaces";
import { UpdateWishListDto } from "./dto/update-wish-list.dto";

@Resolver("wish-list")
export class WishListResolver {
  constructor(private readonly wishListService: WishListService, @Inject("PUB_SUB") private pubSub: PubSubEngine) {
  }

  // @Public()
  @Query("wishListsCurrentUser")
  wishListsCurrentUser(@GetCurrentUserId() uid: string) {
    return this.wishListService.getAll(uid);
  }

  @Public()
  @Query("wishLisByIdForUser")
  wishLisByIdForUser(@Args("uidUser") uidUser: string, @Args("uidList") uidList: string) {
    return this.wishListService.getListByIdForUser({ uidUser, uid: uidList });
  }

  @Mutation("createList")
  async createList(@Args("data") data, @GetCurrentUserId() uid: string) {
    console.log(data, uid);
    const newList = await this.wishListService.addList({ ...data, uidUser: uid });
    await this.pubSub.publish("listCreated", { listCreated: newList });
    // await this.pubSub.publish("list", { list: newList });
    return newList;
  }

  @Mutation("removeList")
  async removeList(@Args("uid") uid, @GetCurrentUserId() uidUser: string) {
    const deletedList = await this.wishListService.removeById({uid, uidUser });
    // await this.pubSub.publish("listCreated", { listCreated: deletedList });
    await this.pubSub.publish("list", { list: deletedList });
    return deletedList;
  }

  @Mutation("updateList")
  async updateList(@Args("data") data: UpdateWishListDto, @GetCurrentUserId() uidUser: string) {
    // data.uidUser = uidUser
    const updatedList = await this.wishListService.updateList(data);
    // await this.pubSub.publish("listCreated", { listCreated: deletedList });
    // await this.pubSub.publish("list", { list: deletedList });
    return updatedList
  }

  @Public()
  // @UseGuards(AtWsGuard)
  @Subscription(returns => WishList, {
    name: "listCreated",
    filter: (payload, variables) =>
      payload.listCreated.uidUser === variables.uidUser
  })
  async listCreated(@Args("uidUser") uidUser: string) {
    console.log("Subscription", uidUser);
    return this.pubSub.asyncIterator("listCreated");
  }

  @Public()
  // @UseGuards(AtWsGuard)
  @Subscription(returns => WishList, {
    name: "list",
    filter: (payload, variables) =>
      payload.list.uidUser === variables.uidUser
  })
  async list(@Args("uidUser") uidUser: string) {
    console.log('list');
    return this.pubSub.asyncIterator("list");
  }
}
