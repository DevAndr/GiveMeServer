import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, SignUpDto } from "./dto/auth.dto";
import { AuthResp, Tokens } from "./types";
import { RtGuard } from "../common/decorators/guards";
import { Cookies, GetCurrentUser, GetCurrentUserId, Public } from "../common/decorators";
import { UserService } from "../user/user.service";
import { Req } from "@nestjs/common";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post("signIn")
  @Public()
  @HttpCode(HttpStatus.OK)
  async signInLocal(@Req() req, @Body() authDto: AuthDto): Promise<AuthResp> {
    const { tokens, user } = await this.authService.signInLocal(authDto);
    // this.setTokensCookie(req, tokens);
    return {tokens, user};
  }

  @Post("signUp")
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async signUpLocal(@Req() req, @Body() authDto: SignUpDto): Promise<AuthResp> {
    const {tokens, user} = await this.authService.signUpLocal(authDto);
    console.log("tokens", tokens);
    // this.setTokensCookie(req, tokens)
    return {tokens, user}
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
  async refreshToken(
    @Req() req,
    @GetCurrentUserId() id: string,
    @GetCurrentUser("refreshToken") refreshToken: string
  ): Promise<Tokens> {
    const tokens = await this.authService.refreshToken(id, refreshToken);
    console.log('refreshToken', id, refreshToken, tokens);    
    // this.setTokensCookie(req, tokens);
    return tokens;
  }

  @Get("twitch")
  @Public()
  @HttpCode(HttpStatus.OK)
  async authTwitch(@Req() req) {
    await this.authService.getTokensTwitch("");
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
    resp.status(200).send();
  }

 setTokensCookie(req: Request, tokens: Tokens) {
    // @ts-ignore
    req.res.cookie("access_token", `${tokens.access_token}`, {
      httpOnly: true,
      maxAge: 50000 //1000 * 60 * 60 * 24 * 7,
    });

    // @ts-ignore
    req.res.cookie("refresh_token", `${tokens.refresh_token}`, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
  }
}
