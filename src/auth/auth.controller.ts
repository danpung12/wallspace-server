import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // GET /auth/me — 인증된 사용자의 ID와 이메일 조회
  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Req() req) {
    return {
      id: req.user.id,
      email: req.user.email,
    };
  }
}
