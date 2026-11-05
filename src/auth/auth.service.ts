import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  createClient,
  isAuthRetryableFetchError,
  SupabaseClient,
} from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Supabase 환경변수가 필요합니다.');
    }

    this.supabase = createClient(url, key);
  }

  async validateToken(token: string) {
    const result = await this.supabase.auth.getUser(token);

    const user = result.data.user;
    const error = result.error;

    if (isAuthRetryableFetchError(error)) {
      throw new ServiceUnavailableException('인증 서버에 연결할 수 없습니다.');
    }

    if (error || !user) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다');
    }

    return user;
  }
}
