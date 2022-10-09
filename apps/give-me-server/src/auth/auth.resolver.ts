import { Args, Context, GraphQLExecutionContext, Mutation, Query, Resolver } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { AuthDto, SignUpDto } from "./dto/auth.dto";
import { AuthService } from "./auth.service";
import { CheckAuthData, Tokens } from "./types";
import { GqlContext } from "../app.module";
import { UseGuards } from "@nestjs/common";
import { RtGuard } from "../common/decorators/guards";
import { Cookies, GetCurrentUser, GetCurrentUserId, Public } from "../common/decorators";

@Resolver("auth")
export class AuthResolver {
  constructor(private readonly jwt: JwtService, private readonly authService: AuthService) {
  }

  @Query("checkAuth")
  async checkAuth(): Promise<CheckAuthData> {
    console.log("checkAuth");
    return { isAuth: true };
  }

  @Public()
  @Mutation("logIn")
  async login(@Args("data") authDto: AuthDto,
              @Context() context: GqlContext,
              @Cookies("uid") uid: String
  ): Promise<Tokens> {
    const tokens = await this.authService.signInLocal(authDto);
    // @ts-ignore
    context.req.res.cookie("access_token", `${tokens.access_token}`, {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    // @ts-ignore
    context.req.res.cookie("refresh_token", `${tokens.refresh_token}`, {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24 * 30

    });

    return tokens;
  }

  @Public()
  @Mutation("signUp")
  async signUp(@Args("data") authDto: SignUpDto, @Context() context: GqlContext): Promise<Tokens> {
    const maxAge = new Date().getTime() + 60000;
    const tokens = await this.authService.signUpLocal(authDto);
    // @ts-ignore
    context.req.res.cookie("access_token", `${tokens.access_token}`, {
      httpOnly: false,
      maxAge
    });

    // @ts-ignore
    context.req.res.cookie("refresh_token", `${tokens.refresh_token}`, {
      httpOnly: false,
      maxAge
    });

    return tokens;
  }

  @Public()
  @UseGuards(RtGuard)
  @Mutation("refresh")
  async refreshToken(@GetCurrentUserId() uid: string,
                     @GetCurrentUser("refreshToken") refreshToken: string,
                     @Context() context: GqlContext): Promise<Tokens> {

    const tokens = await this.authService.refreshToken(uid, refreshToken);

    // @ts-ignore
    context.req.res.cookie("access_token", `${tokens.access_token}`, {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    // @ts-ignore
    context.req.res.cookie("refresh_token", `${tokens.refresh_token}`, {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

    return tokens;
  }
}
