import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(ctx: ExecutionContext) {
    const ctxGql = GqlExecutionContext.create(ctx);

    console.log('GqlAuthGuard', ctxGql.getContext().req);
    return ctxGql.getContext().req;

  }

}
