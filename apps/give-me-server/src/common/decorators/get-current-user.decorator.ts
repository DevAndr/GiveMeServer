import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload, JwtPayloadWithRt } from "../../auth/types";
import { GqlExecutionContext } from "@nestjs/graphql";

export const GetCurrentUser = createParamDecorator((data: keyof JwtPayloadWithRt| undefined, ctx: ExecutionContext) => {
  if (ctx.getType() === 'http') {
    const req = ctx.switchToHttp().getRequest()
    if (!data) return req.user
    return req.user[data]
  }

  const ctxGql = GqlExecutionContext.create(ctx)
  const user = ctxGql.getContext().req?.user
  // console.log('user', user, data);
  if (!user)
    return null

  return user[data]
})
