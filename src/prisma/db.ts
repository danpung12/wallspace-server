import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json';

// 생성된 DB 계약과 연결 주소로 애플리케이션에서 공유할 Prisma 클라이언트 생성
export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
});
