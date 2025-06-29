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
import {Roles} from "../common/decorators/roles.decorator";

@Resolver("wish-list")
export class WishListResolver {
  constructor(private readonly wishListService: WishListService, @Inject("PUB_SUB") private pubSub: PubSubEngine) {
  }

  // @Public()
  @Query("wishListsCurrentUser")
  wishListsCurrentUser(@GetCurrentUserId() id: string) {
    return this.wishListService.getAll(id);
  }

  @Public()
  @Query("wishLisByIdForUser")
  wishLisByIdForUser(@Args("idUser") idUser: string, @Args("idList") idList: string) {
    return this.wishListService.getListByIdForUser({ idUser, id: idList });
  }

  @Roles("ADMIN")
  @Mutation("createList")
  async createList(@Args("data") data, @GetCurrentUserId() id: string) {
    console.log(data, id);
    const newList = await this.wishListService.addList({ ...data, idUser: id });
    await this.pubSub.publish("listCreated", { listCreated: newList });
    return newList;
  }

  @Roles("ADMIN")
  @Mutation("removeList")
  async removeList(@Args("id") id, @GetCurrentUserId() idUser: string) {
    const deletedList = await this.wishListService.removeById({id, idUser }); 
    await this.pubSub.publish("listRemoved", { list: deletedList });
    return deletedList;
  }

  @Roles("ADMIN")
  @Mutation("updateList")
  async updateList(@Args("data") data: UpdateWishListDto, @GetCurrentUserId() idUser: string) {
    // data.idUser = idUser
    const updatedList = await this.wishListService.updateList(data);
    // await this.pubSub.publish("listCreated", { listCreated: deletedList });
    // await this.pubSub.publish("list", { list: deletedList });
    return updatedList
  }

  @Public()
  @Subscription(returns => WishList, {
    name: "listCreated",
    filter: (payload, variables) => payload.listCreated.idUser === variables.idUser
  })
  async listCreated(@Args("idUser") idUser: string) {
    console.log("listCreated", idUser);
    return this.pubSub.asyncIterator("listCreated");
  }

  @Public()
  @Subscription(returns => WishList, {
    name: "listRemoved",
    filter: (payload, variables) =>
      payload.list.idUser === variables.idUser
  })
  async listRemoved(@Args("idUser") idUser: string) {
    console.log('listRemoved', idUser);
    return this.pubSub.asyncIterator("listRemoved");
  }
}
