import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../auth/types';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetCurrentUserId = createParamDecorator((_: undefined, ctx: ExecutionContext): string => {
  if (ctx.getType() === 'http') {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.sub;
  }



  const ctxGql = GqlExecutionContext.create(ctx)
  const user = ctxGql.getContext().req.user  as JwtPayload;
  // console.log("GetCurrentUserId user", user);
  if (!user)
    return null

  return user.sub;
});
