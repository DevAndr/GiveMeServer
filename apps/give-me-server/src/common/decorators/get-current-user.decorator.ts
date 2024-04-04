import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload, JwtPayloadWithRt } from "../../auth/types";
import { GqlExecutionContext } from "@nestjs/graphql";

export const GetCurrentUser = createParamDecorator((field: keyof JwtPayloadWithRt| undefined, ctx: ExecutionContext) => {
  if (ctx.getType() === 'http') {
    const req = ctx.switchToHttp().getRequest()
    if (!field) return req.user
    return req.user[field]
  }

  const ctxGql = GqlExecutionContext.create(ctx)
  const user = ctxGql.getContext().req?.user
  // console.log('user', user, field);
  if (!user)
    return null

  return user[field]
})
