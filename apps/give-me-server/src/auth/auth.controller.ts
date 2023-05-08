import {Body, Controller, Get, HttpCode, HttpStatus, Post, Redirect, Request, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignUpDto } from "./dto/auth.dto";
import { Tokens } from './types';
import { RtGuard } from '../common/decorators/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService,
              private readonly authService: AuthService) {
  }

  @Post('signUp')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async signUpLocal(@Body() authDto: SignUpDto): Promise<Tokens> {
    return this.authService.signUpLocal(authDto);
  }

  @Post('signIn')
  @Public()
  @HttpCode(HttpStatus.OK)
  async signInLocal(@Body() authDto: AuthDto): Promise<Tokens> {
    console.log('signInLocal', authDto);
    return this.authService.signInLocal(authDto);
  }


  @Post('logOut')
  @HttpCode(HttpStatus.OK)
  async logOutLocal(@GetCurrentUserId() uid: string): Promise<boolean> {
    return this.authService.logOutLocal(uid);
  }

  @Post('refresh')
  @Public()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@GetCurrentUserId() uid: string, @GetCurrentUser('refreshToken') refreshToken: string): Promise<Tokens> {
    return this.authService.refreshToken(uid, refreshToken);
  }

  @Get('twitch')
  @Public()
  @Redirect('https://id.twitch.tv/oauth2/authorize/?response_type=token' +
      '&client_id=hof5gwx0su6owfnys0yan9c87zr6t' +
      '&redirect_uri=http://localhost:3030/grapphql' +
      '&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls')
  @HttpCode(HttpStatus.OK)
  async authTwitch(@Request() req){

  }

  @Get('twitch/redirect')
  @Public()
  @HttpCode(HttpStatus.OK)
  async authTwitchRedirect(){

  }
}
