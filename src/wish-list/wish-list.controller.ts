import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateWishListDto } from './dto/create-wish-list.dto';
import { WishListService } from './wish-list.service';
import { Public } from '../common/decorators';
import { DeleteWishListDto } from './dto/delete-wish-list.dto';
import { RtGuard } from '../common/decorators/guards';

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
  @UseGuards(RtGuard)
  get(@Param('uid') uid: string) {
    return this.wshListService.getListById(uid)
  }

  @Post('remove')
  @Public()
  @UseGuards(RtGuard)
  remove(@Body() deleteWishListDto: DeleteWishListDto) {
    return this.wshListService.removeById(deleteWishListDto)
  }

  @Post('remove-all')
  @UseGuards(RtGuard)
  removeAll(@Body('uidUser') uidUser: string) {
    return this.wshListService.removeAll(uidUser)
  }

  @Post('create')
  @Public()
  @UseGuards(RtGuard)
  create(@Body() createWishListDto: CreateWishListDto){
    return this.wshListService.addList(createWishListDto)
  }

}
