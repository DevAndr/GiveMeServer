import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Redirect,
  Req,
  Request,
  Res,
  UseGuards
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, SignUpDto } from "./dto/auth.dto";
import { Tokens } from "./types";
import { RtGuard } from "../common/decorators/guards";
import { GetCurrentUser, GetCurrentUserId, Public } from "../common/decorators";
import { UserService } from "../user/user.service";
import axios from "axios";

@Controller("auth")
export class AuthController {
  constructor(private readonly userService: UserService,
              private readonly authService: AuthService) {
  }

  @Post("signUp")
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async signUpLocal(@Body() authDto: SignUpDto): Promise<Tokens> {
    return this.authService.signUpLocal(authDto);
  }

  @Post("signIn")
  @Public()
  @HttpCode(HttpStatus.OK)
  async signInLocal(@Body() authDto: AuthDto): Promise<Tokens> {
    console.log("signInLocal", authDto);
    const {tokens} = await this.authService.signInLocal(authDto);
    return tokens
  }


  @Post("logOut")
  @HttpCode(HttpStatus.OK)
  async logOutLocal(@GetCurrentUserId() id: string): Promise<boolean> {
    return this.authService.logOutLocal(id);
  }

  @Post("refresh")
  @Public()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@GetCurrentUserId() id: string, @GetCurrentUser("refreshToken") refreshToken: string): Promise<Tokens> {
    return this.authService.refreshToken(id, refreshToken);
  }

  @Get("twitch")
  @Public()
  @HttpCode(HttpStatus.OK)
  async authTwitch(@Req() req) {

    await this.authService.getTokensTwitch('');
  }

  @Get("twitch/oauth")
  @Public()
  @HttpCode(HttpStatus.OK)
  async authTwitchRedirect(@Res() resp) {
    const url = this.authService.oauthUrlTwitch();
    resp.redirect(url);
  }

  @Post("twitch")
  @Public()
  @HttpCode(HttpStatus.OK)
  async check(@Res() resp, @Req() req) {
    console.log(resp, req);
    resp.status(200).send()
  }
}
