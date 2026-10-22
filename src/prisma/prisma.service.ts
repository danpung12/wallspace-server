import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { db } from './db';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  readonly db = db;

  async onModuleInit() {
    await this.db.connect();
  }

  async onModuleDestroy() {
    await this.db.close();
  }
}
