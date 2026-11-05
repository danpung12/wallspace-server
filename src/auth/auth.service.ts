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

  // 필수 환경변수를 확인하고 Supabase 인증에 사용할 클라이언트 생성
  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Supabase 환경변수가 필요합니다.');
    }

    this.supabase = createClient(url, key);
  }

  // Supabase에서 토큰을 검증하고 사용자 정보를 반환한다.
  // 1. 토큰으로 사용자 정보 요청
  // 2. 재시도 가능한 통신 오류는 503, 그 외 오류나 사용자 없음은 401 처리
  // 3. 검증에 성공한 사용자 반환
  async validateToken(token: string) {
    const result = await this.supabase.auth.getUser(token);

    const user = result.data.user;
    const error = result.error;

    // 인증 서버 장애를 토큰 오류와 구분해 클라이언트가 재시도할 수 있도록 한다.
    if (isAuthRetryableFetchError(error)) {
      throw new ServiceUnavailableException('인증 서버에 연결할 수 없습니다.');
    }

    if (error || !user) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다');
    }

    return user;
  }

  
}
