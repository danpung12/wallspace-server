import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  // 토큰을 검증해 인증된 요청만 컨트롤러로 전달한다.
  // 1. Authorization 헤더에서 Bearer 토큰 추출 및 형식 확인
  // 2. AuthService를 통해 Supabase에 토큰 검증 요청
  // 3. 검증된 사용자를 req.user에 저장하고 요청 통과
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authorization = req.headers.authorization;

    const [type, token] = authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('인증 토큰이 필요합니다.');
    }

    req.user = await this.authService.validateToken(token);

    return true;
  }
}
