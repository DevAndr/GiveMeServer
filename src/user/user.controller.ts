import { Body, Controller, Get, Header, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {

  @Get()
  @HttpCode(HttpStatus.OK)
  getUser(): string {
    return 'user';
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  createUser(@Body() user: CreateUserDto) {
    return {user}
  }
}
