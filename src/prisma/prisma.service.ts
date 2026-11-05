import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { db } from './db';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  readonly db = db;

  // 모듈 초기화 시 공유 DB 클라이언트 연결
  async onModuleInit() {
    await this.db.connect();
  }

  // 모듈 종료 시 DB 연결 정리
  async onModuleDestroy() {
    await this.db.close();
  }
}
