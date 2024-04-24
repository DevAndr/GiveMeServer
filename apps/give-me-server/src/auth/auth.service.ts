import { ForbiddenException, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto, SignUpDto } from "./dto/auth.dto";
import * as argon from "argon2";
import {JwtPayload, Tokens} from "./types";
import { JwtService } from "@nestjs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import axios from "axios";
import { TwitchResponse } from "./dto/auth.twitch.dto";
import { LogInResp } from "./types/log-in.type";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
              private readonly config: ConfigService,
              private readonly prismaService: PrismaService,
              private readonly jwtService: JwtService) {
  }

  async signUpLocal(authDto: SignUpDto): Promise<Tokens> {
    const hash = await argon.hash(authDto.password);

    const newUser = await this.prismaService.user.create({
      data: {
        email: authDto.email,
        name: authDto.name,
        hash
      }
    }).catch((e) => {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new ForbiddenException(`пользователь с email: ${authDto.email} уже существует`);
        }
      }
      throw e;
    });

    const tokens = await this.genTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async signInLocal(authDto: AuthDto): Promise<LogInResp> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDto.email
      }
    });

    if (!user) throw new ForbiddenException("Access Denied");

    const passwordMatches = await argon.verify(user.hash, authDto.password);
    if (!passwordMatches) throw new ForbiddenException("Access Denied");

    const tokens = await this.genTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return {tokens, uid: user.id};
  }

  async logOutLocal(id: string): Promise<boolean> {
    await this.prismaService.user.updateMany({
      where: {
        id,
        hasheRt: {
          not: null
        }
      }, data: {
        hasheRt: null
      }
    });

    return true;
  }

  async refreshToken(id: string, rt: string): Promise<Tokens> {

    const user = await this.prismaService.user.findUnique({
      where: {
        id
      }
    });

    if (!user || !user.hasheRt) throw new ForbiddenException("Access Denied");

    const rtMatches = await argon.verify(user.hasheRt, rt);
    if (!rtMatches) throw new ForbiddenException("Access Denied");

    const tokens = await this.genTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async genTokens(id: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: id,
      email: email
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, { expiresIn: "7d", secret: this.config.get<string>("AT_SECRET") }),
      this.jwtService.signAsync(jwtPayload, { expiresIn: "30d", secret: this.config.get<string>("RT_SECRET") })
    ]);

    return {
      access_token: at,
      refresh_token: rt
    };
  }

  async updateRtHash(id: string, rt: string) {
    const hash = await argon.hash(rt);
    await this.prismaService.user.update({
      where: {
        id
      },
      data: {
        hasheRt: hash
      }
    });
  }

  oauthUrlTwitch(): string {
    return `${this.config.get("URL_OAUTH_TWITCH")}?response_type=code&client_id=${this.config.get("CLIENT_ID")}&redirect_uri=${this.config.get("REDIRECT_URL")}&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls&state=c3ab8aa609ea11e793ae92361f002671`;
  }

  async getTokensTwitch(code: string): Promise<TwitchResponse | null> {
    // const {data, status} = await axios.post<TwitchResponse>(`${this.config.get('URL_OAUTH_TWITCH_TOKEN')}`, {
    //   'client_id': this.config.get('CLIENT_ID'),
    //   'client_secret': this.config.get('SECRET_CLIENT'),
    //   'grant_type': 'client_credentials'
    // }, {
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   }
    // });

    if (code) {
      const {
        data,
        status,
        statusText
      } = await axios.post<TwitchResponse>(`${this.config.get("URL_OAUTH_TWITCH_TOKEN")}`, {
        "client_id": this.config.get("CLIENT_ID"),
        "client_secret": this.config.get("SECRET_CLIENT"),
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://localhost:3000"
      }, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      if (data)
        return data;
    }

    return null;
  }
}
