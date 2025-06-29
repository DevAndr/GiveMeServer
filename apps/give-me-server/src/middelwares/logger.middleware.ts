import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../auth/auth.service";
import { jwtDecode } from "jwt-decode";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const cookies = req.cookies;
    // console.log("Request...", cookies);

    if (cookies?.access_token === undefined) {
    //   console.warn("No access token", req.url);
      if (cookies?.refresh_token) {
        const decodeToken = jwtDecode(cookies.refresh_token);
        // console.log("Found refresh token", decodeToken.sub);
        // this.authService
        //   .refreshToken(decodeToken.sub, cookies?.refresh_token)
        //   .then((tokens) => {
        //     console.log(tokens);

        //     if (tokens) {
        //       // @ts-ignore
        //       req.res.cookie("access_token", `${tokens.access_token}`, {
        //         httpOnly: false,
        //         maxAge: 50000, //1000 * 60 * 60 * 24 * 7,
        //       });

        //       // @ts-ignore
        //       req.res.cookie("refresh_token", `${tokens.refresh_token}`, {
        //         httpOnly: false,
        //         maxAge: 1000 * 60 * 60 * 24 * 30,
        //       });
        //     }

        //     next();
        //   });
      }
    }

    next();
  }
}
