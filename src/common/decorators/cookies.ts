import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    if (ctx.getType() !== "http") {
      const ctxGql = GqlExecutionContext.create(ctx);
      const request = ctxGql.getContext().req;
      return data ? request.cookies?.[data] : request.cookies;
    }
  });