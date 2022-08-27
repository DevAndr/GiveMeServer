import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadWithRt } from '../../auth/types';

export const GetCurrentUser = createParamDecorator((data: keyof JwtPayloadWithRt| undefined, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()
  console.log('GetCurrentUser');
  if (!data) return req.user
  return req.user[data]
})
