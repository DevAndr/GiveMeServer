import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator((data: undefined, ctx: ExecutionContext): number => {
  const req = ctx.switchToHttp().getRequest()
  if (!data) return req.user
  return req.user['sub']
})
