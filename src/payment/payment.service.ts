import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  // 결제할 주문번호와 작가 ID가 일치하는 예약 한 건을 조회한다.
  async findMyBooking(artistId: string, orderId: string) {
    const booking = await this.prisma.db.orm.public.Reservations.where({
      artistId,
      orderId,
    }).first();

    if (!booking) {
      throw new NotFoundException('예약이 없습니다.');
    }

    return booking;
  }
}
