import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { JwtPayload } from "../types";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { AuthService } from "../auth.service";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.get<string>("AT_SECRET"),
    });
  }

  async validate(payload: JwtPayload) {
    // console.log("AtStrategy", payload);
    return payload;
  }

  private static extractJWT(req: any): string | null {
    const cookies = req.cookies;
    console.log("AtStrategy");

    if (cookies) {
      if (!cookies?.access_token && cookies?.refresh_token) {
        // console.log("request tokens", cookies?.refresh_token);

      }

      return cookies?.access_token;
    }

    return null;
  }
}
