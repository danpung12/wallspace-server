import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Nest 애플리케이션을 생성하고 설정된 포트에서 HTTP 요청 수신 시작
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 종료 신호를 받으면 PrismaService의 종료 훅도 실행해 DB 연결을 정리한다.
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
