import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { TokensService } from '../tokens/tokens.service';
import { TokenHeaderInterceptor } from '../../../common/token.interceptor.ts/token.interceptor';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _tokenService: TokensService,
  ) {}

  @Post('/login')
  @UseInterceptors(TokenHeaderInterceptor)
  async login(@Body() data: LoginDto) {
    return {
      success: true,
      ...(await this._authService.login(data)),
    };
  }
}
