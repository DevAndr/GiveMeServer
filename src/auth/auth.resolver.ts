import { Args, Context, GraphQLExecutionContext, Mutation, Resolver } from "@nestjs/graphql";
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Tokens } from './types';
import { Cookies, Public, ResGql } from "src/common/decorators";
import { GqlContext } from "../app.module";

@Resolver("auth")
export class AuthResolver {
  constructor(private readonly jwt: JwtService,  private readonly authService: AuthService) {}


  @Public()
  @Mutation('logIn')
  async login(@Args('data') authDto: AuthDto,
              @Context() context: GqlContext,
              @Cookies('uid') uid: String,
              // @Context("req") req: Request
  ): Promise<Tokens> {
    const maxAge = new Date().getTime() + 60000
    const tokens = await this.authService.signInLocal(authDto);
    // @ts-ignore
    context.req.res.cookie("access_token", `${tokens.access_token}`, {
      httpOnly: false,
      maxAge
    })

    // @ts-ignore
    context.req.res.cookie("refresh_token", `${tokens.refresh_token}`, {
      httpOnly: false,
      maxAge
    })

    return tokens
  }

  @Public()
  @Mutation('test')
  async test(@Args('email') email: String, @ResGql() res: Response){
    console.log(res, email);
    return email;
  }
}
