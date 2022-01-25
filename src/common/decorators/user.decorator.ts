import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserDec = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      email: request.user.email,
      userId: request.user.id,
    };
  },
);
