import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../auth/types';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetCurrentUserId = createParamDecorator((_: undefined, ctx: ExecutionContext): string => {
  console.log('GetCurrentUserId');

  if (ctx.getType() === 'http') {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    console.log(user);
    return user.sub;
  }



  const ctxGql = GqlExecutionContext.create(ctx)
  return ctxGql.getContext().req.user.sub
});
