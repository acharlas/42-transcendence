import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithAuth } from './types_message';

@Injectable()
export class ControllerAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: RequestWithAuth = context.switchToHttp().getRequest();
    //console.log('request body: ', request.body);

    const { accessToken } = request.body;

    try {
      const payload = this.jwtService.verify(accessToken);
      request.userID = payload.id;
      request.username = payload.username;
      return true;
    } catch {
      throw new ForbiddenException('invalid authorization token');
    }
  }
}
