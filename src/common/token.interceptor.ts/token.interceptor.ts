import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TokenHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse<Response>().status(200);

    return next.handle().pipe(
      tap((data) => {
        res.setHeader('token', data.tokens.token);
        res.setHeader('refresh_token', data.tokens.refreshToken);
        delete data.tokens;
      }),
    );
  }
}
