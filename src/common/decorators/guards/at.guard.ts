import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      ctx.getHandler(),
      ctx.getClass()
    ]);

    const isGraphql = this.reflector.getAllAndOverride('isGraphql', [
      ctx.getHandler(),
      ctx.getClass()
    ]);

    const ctxGql = GqlExecutionContext.create(ctx);

    // console.log('AtGuard', isGraphql, ctxGql.getContext());
    // console.log('AtGuard', isGraphql, ctxGql.getContext());
    console.log(ctxGql.getContext().req.headers.authorization.replace('Bearer', '').trim());

    return isPublic ? true : super.canActivate(ctx);
  }
}
