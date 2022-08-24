import { Body, Controller, Get, Header, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RemoveListDto } from './dto/remove-list.dto';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { AtGuard, RtGuard } from '../common/decorators/guards';
import { UpdateDataUserDto } from './dto/update-data-user.dto';
import { PublicDataUserDto } from './dto/public-data-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post('find')
  @Public()
  @HttpCode(HttpStatus.OK)
  getUser(@Body('uidUser') uidUser: string): Promise<PublicDataUserDto> {
    return this.userService.findUser({ uid: uidUser });
  }

  @Post()
  @Public()
  @HttpCode(HttpStatus.OK)
  getCurrentUser(@GetCurrentUserId() uid: string): Promise<PublicDataUserDto> {
    console.log(uid);
    return this.userService.findUser({ uid: uid });
  }

  @Post("update")
  @HttpCode(HttpStatus.OK)
  updateUserData(@Body() updateDataUserDto: UpdateDataUserDto, @GetCurrentUserId() uid: string): Promise<PublicDataUserDto> {
    return  this.userService.updateUser({
      where: { uid },
      data: { ...updateDataUserDto }
    });
  }

  @Post('remove-list-by-id')
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  removeListById(@Body() removeListDto: RemoveListDto) {
    return this.userService.removeListById(removeListDto);
  }
}
