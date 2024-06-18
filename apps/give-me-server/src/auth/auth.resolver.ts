import {Args, Context, GraphQLExecutionContext, Mutation, Query, Resolver} from "@nestjs/graphql";
import {JwtService} from "@nestjs/jwt";
import {AuthDto, SignUpDto} from "./dto/auth.dto";
import {AuthService} from "./auth.service";
import {AuthResp, CheckAuthData, Tokens} from "./types";
import {GqlContext} from "../app.module";
import {UseGuards} from "@nestjs/common";
import {RtGuard} from "../common/decorators/guards";
import {Cookies, GetCurrentUser, GetCurrentUserId, Public} from "../common/decorators";

@Resolver("auth")
export class AuthResolver {
    constructor(private readonly jwt: JwtService, private readonly authService: AuthService) {
    }

    @Query("checkAuth")
    async checkAuth(@Context() context: GqlContext, @Cookies("id") id: String): Promise<CheckAuthData> {
        console.log("checkAuth", id);
        return {isAuth: true};
    }

    @Public()
    @Mutation("logIn")
    async logIn(@Args("data") authDto: AuthDto, @Context() context: GqlContext): Promise<Tokens> {
        const {tokens, user} = await this.authService.signInLocal(authDto);
        this.setTokensCookie(context, tokens)
        // @ts-ignore
        context.req.res.cookie("uid", user.id, {
            httpOnly: false, 
        });

        return tokens;
    }

    @Public()
    @Mutation("signUp")
    async signUp(@Args("data") authDto: SignUpDto, @Context() context: GqlContext): Promise<AuthResp> {
        const maxAge = new Date().getTime() + 60000;
        const {tokens, user} = await this.authService.signUpLocal(authDto);
        this.setTokensCookie(context, tokens)
        return {tokens, user};
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

 

    setTokensCookie(ctx: GqlContext, tokens: Tokens) {
        // @ts-ignore
        ctx.req.res.cookie("access_token", `${tokens.accessToken}`, {
            httpOnly: false,
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        // @ts-ignore
        ctx.req.res.cookie("refresh_token", `${tokens.refreshToken}`, {
            httpOnly: false,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
    }
}
