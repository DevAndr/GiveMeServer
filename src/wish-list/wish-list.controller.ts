import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateWishListDto } from './dto/create-wish-list.dto';
import { WishListService } from './wish-list.service';
import { Public } from '../common/decorators';
import { DeleteWishListDto } from './dto/delete-wish-list.dto';

@Controller('wish-list')
export class WishListController {
  constructor(private readonly wshListService: WishListService) {}

  @Post('all')
  @Public()
  getAll(@Body('uidUser') uidUser: string) {
    return this.wshListService.getAll(uidUser)
  }

  @Get(':uid')
  @Public()
  get(@Param('uid') uid: string) {
    return this.wshListService.getListById(uid)
  }

  @Post('remove')
  @Public()
  remove(@Body() deleteWishListDto: DeleteWishListDto) {
    return this.wshListService.removeById(deleteWishListDto)
  }

  @Post('remove-all')
  removeAll(@Body('uidUser') uidUser: string) {
    return this.wshListService.removeAll(uidUser)
  }

  @Post('create')
  @Public()
  create(@Body() createWishListDto: CreateWishListDto){
    return this.wshListService.addList(createWishListDto)
  }

}
