import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { GetCurrentUser, Public } from '../common/decorators'
import { GqlAuthGuard } from '../common/decorators/guards'
import { CreateWishListDto } from './dto/create-wish-list.dto'
import { DeleteWishListDto } from './dto/delete-wish-list.dto'
import { WishListService } from './wish-list.service'

@Controller('wish-list')
export class WishListController {
	constructor(private readonly wshListService: WishListService) {}

	@Post('all')
	// @Public()
	@UseGuards(GqlAuthGuard)
	getAll(@Body('userId') userId: string) {
		return this.wshListService.getAll(userId)
	}

	@Get(':id')
	@Public()
	get(@Param('id') id: string) {
		return this.wshListService.getListById(id)
	}

	@Get('wishListsCurrentUser')
	getWishListsCurrentUser(@GetCurrentUser() id: string) {
		return this.wshListService.getAll(id)
	}

	@Post('wishListByIdForUser')
	@Public()
	getWishListByIdForUser(
		@Body('userId') userId: string,
		@Body('listId') listId: string
	) {
		console.log(userId, listId)
		return this.wshListService.getListByIdForUser({
			uidUser: userId,
			uid: listId,
		})
	}

	@Post('remove')
	remove(@Body() deleteWishListDto: DeleteWishListDto) {
		return this.wshListService.removeById(deleteWishListDto)
	}

	@Post('remove-all')
	removeAll(@Body('userId') userId: string) {
		return this.wshListService.removeAll(userId)
	}

	@Post('create')
	@Public()
	create(@Body() createWishListDto: CreateWishListDto) {
		return this.wshListService.addList(createWishListDto)
	}
}
