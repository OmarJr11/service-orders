import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import bcrypt = require('bcrypt');
import { User } from '../../../models/user.entity';
import { TokensService } from '../tokens/tokens.service';
import { TokensInterface } from '../../../common/interfaces/tokens.interface';
import * as _ from 'lodash';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly _userService: UsersService,
    private readonly _configService: ConfigService,
    private readonly _tokenService: TokensService,
    private readonly _rolesService: RolesService,
  ) {}
  /**
   * Login User
   * @param {LoginDto} data - Information to login in the platform
   * @returns {Promise<{ user: User; tokens: TokensInterface }>}
   */
  async login(
    data: LoginDto,
  ): Promise<{ user: User; tokens: TokensInterface }> {
    const user = await this._userService.getByEmail(data.email);

    if (!user || _.isEmpty(user)) {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid User/Password',
      });
    }

    if (!user || !bcrypt.compareSync(data.password, user.password)) {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid User/Password',
      });
    }

    delete user.password;

    return {
      user,
      tokens: await this._tokenService.generateTokensAndSaveThem(user),
    };
  }
}
