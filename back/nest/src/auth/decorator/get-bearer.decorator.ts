import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const GetBearer = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    console.log('user:', request.user);
    if (request.user == undefined) {
      console.log('GetUser: Could not get user from request, throwing 400');
      throw new BadRequestException('Could not get user');
    }
    if (data) {
      return request.user[data];
    }

    return request.user;
  },
);
