import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
      if (ctx.getType() === "http") {
          const request = ctx.switchToHttp().getRequest();
          return data ? request?.cookies?.[data] : request?.cookies;
      }

      const ctxGql = GqlExecutionContext.create(ctx);
      const req = ctxGql.getContext().req;
      return data ? req.cookies?.[data] : req.cookies;
  });