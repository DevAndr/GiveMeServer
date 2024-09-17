import {Args, Context, GraphQLExecutionContext, Mutation, Query, Resolver} from "@nestjs/graphql";
import {JwtService} from "@nestjs/jwt";
import {AuthDto, SignUpDto} from "./dto/auth.dto";
import {AuthService} from "./auth.service";
import {CheckAuthData, Tokens} from "./types";
import {GqlContext} from "../app.module";
import {UseGuards} from "@nestjs/common";
import {RtGuard} from "../common/decorators/guards";
import {Cookies, GetCurrentUser, GetCurrentUserId, Public} from "../common/decorators";

@Resolver("auth")
export class AuthResolver {
    constructor(private readonly jwt: JwtService, private readonly authService: AuthService) {
    }

    @Query("checkAuth")
    async checkAuth(@Context() context: GqlContext, @Cookies("uid") id: String): Promise<CheckAuthData> {
        console.log("checkAuth", id);
        return {isAuth: true};
    }

    @Public()
    @Mutation("logIn")
    async logIn(@Args("data") authDto: AuthDto, @Context() context: GqlContext): Promise<Tokens> {
        const {tokens, uid} = await this.authService.signInLocal(authDto);
        this.setTokensCookie(context, tokens)
        // @ts-ignore
        context.req.res.cookie("uid", uid, {
            httpOnly: false,
        });

        return tokens;
    }

    @Public()
    @Mutation("signUp")
    async signUp(@Args("data") authDto: SignUpDto, @Context() context: GqlContext): Promise<Tokens> {
        const maxAge = new Date().getTime() + 60000;
        const tokens = await this.authService.signUpLocal(authDto);
        this.setTokensCookie(context, tokens)
        return tokens;
    }

    @Public()
    @UseGuards(RtGuard)
    @Mutation("refresh")
    async refreshToken(@GetCurrentUserId() id: string,
                       @GetCurrentUser("refreshToken") refreshToken: string,
                       @Context() context: GqlContext): Promise<Tokens> {
        const tokens = await this.authService.refreshToken(id, refreshToken);
        this.setTokensCookie(context, tokens)

        return tokens;
    }


    @Public()
    // @UseGuards(RtGuard)
    @Mutation("twitch")
    async twitch(@Args("code") code: string,
                 @GetCurrentUserId() id: string,
                 @GetCurrentUser("refreshToken") refreshToken: string,
                 @Context() context: GqlContext): Promise<Tokens | null> {

        const tokens = await this.authService.getTokensTwitch(code);

        if (tokens) {
            this.setTokensCookie(context, tokens)

            return {...tokens} as Tokens;
        }

        return null;
    }


    setTokensCookie(ctx: GqlContext, tokens: Tokens) {
        // @ts-ignore
        ctx.req.res.cookie("access_token", `${tokens.access_token}`, {
            httpOnly: false,
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        // @ts-ignore
        ctx.req.res.cookie("refresh_token", `${tokens.refresh_token}`, {
            httpOnly: false,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
    }
}
