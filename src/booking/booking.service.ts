import { Injectable } from '@nestjs/common';
import { db } from 'src/prisma/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  // 전달받은 작가 ID와 일치하는 예약 목록 조회
  async myBooking(artistId: string) {
    const bookings = await db.orm.public.Reservations.where({ artistId }).all();
    return bookings;
  }

  
}
