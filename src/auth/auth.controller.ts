import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Credentials } from './interfaces/credentials.dto';
import { Response, Request } from 'express';

const REFRESH_TOKEN = 'refresh_token';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('jwt/create')
  async createJwt(@Body() credentials: Credentials, @Res() res: Response): Promise<Response> {
    const { access, refresh } = await this.authService.checkCredentials(credentials);

    res.cookie(REFRESH_TOKEN, refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return res.send({ access });
  }

  @Post('jwt/refresh')
  async refreshJwt(@Req() req: Request): Promise<{ access: string }> {
    const access = await this.authService.checkRefreshToken(req.cookies[REFRESH_TOKEN] as string);

    return { access };
  }

  @Post('jwt/logout')
  async logout(@Res() res: Response): Promise<Response> {
    res.clearCookie(REFRESH_TOKEN);
    return res.sendStatus(200);
  }
}
