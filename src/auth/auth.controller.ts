import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AtGuard, RtGuard } from '../common/decorators/guards';
import { GetCurrentUser, GetCurrentUserId } from '../common/decorators';

@Controller('auth')

export class AuthController {
  constructor(private readonly userService: UserService,
              private readonly authService: AuthService) {
  }

  @Post('signUp')
  @HttpCode(HttpStatus.CREATED)
  async signUpLocal(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.signUpLocal(authDto);
  }

  @Post('signIn')
  @HttpCode(HttpStatus.OK)
  async signInLocal(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.signInLocal(authDto);
  }


  @Post('logOut')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async logOutLocal(@GetCurrentUserId() uid: number) {
    return this.authService.logOutLocal(uid);
  }

  @Post('refresh')
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@GetCurrentUserId() uid: number, @GetCurrentUser('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(uid, refreshToken);
  }
}
