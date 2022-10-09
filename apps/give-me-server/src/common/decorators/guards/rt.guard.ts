import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from "@nestjs/graphql";
import { ExecutionContext } from '@nestjs/common';

export class RtGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest()
    }

    const ctx = GqlExecutionContext.create(context);
    // const headers = ctx.getContext().req.headers
    // const cookies = ctx.getContext().req.cookies
    // console.log(ctx.getContext().req['headers'], ctx.getContext().req['body']);
    // console.log(headers, cookies);
    return ctx.getContext().req;
  }
}
