import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (request.user == undefined) {
      console.log("GetUser: Could not get user from request, throwing 400");
      throw new BadRequestException("Could not get user");
    }
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
