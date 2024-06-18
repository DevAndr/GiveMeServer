import { ThinUser } from "libs/common/types";

 
export type Tokens = {
  accessToken: string;
  refreshToken: string;
  expireIn: number;
};

export type JwtPayload = {
    email: string;
    sub: string;
  };

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };

export type AuthResp = {
  tokens: Tokens;
  user: ThinUser;
};

export type CheckAuthData = {
  isAuth: boolean;
};
 