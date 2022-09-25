import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";

@Injectable()
export class AtWsGuard extends AuthGuard('jwt-ws') {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(ctx: ExecutionContext): any {
    console.log(ctx);
      const handshake = ctx.switchToWs().getClient().handshake
      console.log("http");

      return handshake.user;
  }

  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return  super.canActivate(ctx)
  }
}
