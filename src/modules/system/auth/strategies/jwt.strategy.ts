import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenExtractor } from '../../../../common/extractors/token.extractor';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _configService: ConfigService) {
    super({
      jwtFromRequest: TokenExtractor,
      ignoreExpiration: false,
      secretOrKey: _configService.get('TOKEN_SECRET'),
    });
  }

  async validate(payload: any) {
    const { id, firstName, lastName, email } = payload;
    return { id, firstName, lastName, email };
  }
}
