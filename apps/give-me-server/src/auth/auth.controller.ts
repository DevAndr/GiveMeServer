import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
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
  async refreshToken(@GetCurrentUserId() uid: string, @GetCurrentUser('refreshToken') refreshToken: string): Promise<Tokens> {;
    return this.authService.refreshToken(uid, refreshToken);
  }
}