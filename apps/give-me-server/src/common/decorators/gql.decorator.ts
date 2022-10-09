import { createParamDecorator } from '@nestjs/common';
import { Response } from 'express';
import { User } from '@prisma/client';

export const ResGql = createParamDecorator(
  (data, [root, args, ctx, info]): Response => ctx.res,
);

export const GqlUser = createParamDecorator(
  (data, [root, args, ctx, info]): User => {
    console.log('GqlUser', ctx.req);
    return ctx.req && ctx.req.user
  },
);
