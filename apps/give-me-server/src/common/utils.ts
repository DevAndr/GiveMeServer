import {ExtractJwt} from "passport-jwt";

export default class Utils {
    static getTokenFromHeader(req) {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken.apply('')(req)
      return token;
    }
}