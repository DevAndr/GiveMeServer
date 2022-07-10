import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator((_: undefined, ctx: ExecutionContext): number => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  return user.sub;
})