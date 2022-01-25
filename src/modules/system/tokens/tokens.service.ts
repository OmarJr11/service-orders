import {
  forwardRef,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { DataProvider } from '../../../common/providers/data.provider';
import { RefreshToken } from '../../../models/refreshToken.entity';
import { MoreThan, Repository } from 'typeorm';
import { Request } from 'express';
import { User } from '../../../models/user.entity';
import { JwtService } from '@nestjs/jwt';
import { TokensInterface } from '../../../common/interfaces/tokens.interface';
import { UsersService } from '../users/users.service';

@Injectable({ scope: Scope.REQUEST })
export class TokensService extends DataProvider<RefreshToken> {
  constructor(
    @Inject(REQUEST)
    private readonly _userRequest: Request,
    @InjectRepository(RefreshToken)
    private readonly _refreshTokenRepository: Repository<RefreshToken>,
    private readonly _configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private readonly _userService: UsersService,
    private readonly _jwtService: JwtService,
  ) {
    super(_userRequest, _refreshTokenRepository);
  }

  /**
   * Generate Tokens (token and refresh token) and save both
   * in database
   * @param {User} user - entity to activate
   * @returns {Promise<TokensInterface>} - Tokens Saved in database
   */
  async generateTokensAndSaveThem(user: User): Promise<TokensInterface> {
    const data = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const token = this._jwtService.sign(data, {
      expiresIn: +this._configService.get('TOKEN_TIME'),
    });

    const refreshToken = this.generateRandomCodeByLength(400);

    //Set expiration date with 1 month
    const expire = new Date();
    expire.setMonth(expire.getMonth() + 1);

    await this.save({ token, refreshToken, expire, user: user.id });

    return { token, refreshToken };
  }
}
