import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info): any {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException({
        success: false,
        message: `Token Expired`,
      });
    }

    if (err) {
      throw err;
    }

    if (!user) {
      throw new UnauthorizedException({
        success: false,
        message: 'Unauthorized',
      });
    }

    return user;
  }
}
