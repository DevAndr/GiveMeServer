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
  getUser(@Body('idUser') idUser: string): Promise<PublicDataUserDto> {
    return this.userService.findUser({ id: idUser });
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  getCurrentUser(@GetCurrentUserId() id: string): Promise<PublicDataUserDto> {
    console.log(id);
    return this.userService.findUser({ id });
  }

  @Post("update")
  @HttpCode(HttpStatus.OK)
  updateUserData(@Body() updateDataUserDto: UpdateDataUserDto, @GetCurrentUserId() id: string): Promise<PublicDataUserDto> {
    return  this.userService.updateUser({
      where: { id },
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
