import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  // 전달받은 작가 ID와 일치하는 예약 목록 조회
  async myBooking(artistId: string) {
    const bookings = await this.prisma.db.orm.public.Reservations.where({
      artistId,
    }).all();
    return bookings;
  }

  // 공간 요금으로 총액을 계산하고 대기 상태의 예약을 생성한다.
  // 1. 공간을 조회해 하루 요금을 가져온다.
  // 2. 이용 일수와 수수료를 반영해 총액을 계산한다.
  // 3. 인증된 사용자의 예약을 pending 상태로 저장한다.
  async Booking(artistId: string, dto: CreateBookingDto) {
    const space = await this.prisma.db.orm.public.Spaces.where({
      id: dto.spaceId,
    }).first();

    if (!space) {
      throw new NotFoundException('공간을 찾을 수 없습니다');
    }

    const dayCost = Number(space.price);

    const startTime = new Date(dto.startDate).getTime();
    const endTime = new Date(dto.endDate).getTime();
    const totalday = (endTime - startTime) / (24 * 60 * 60 * 1000);

    // 시작일과 종료일을 모두 포함하고, 수수료 10%를 더한 총액을 원 단위로 반올림한다.
    const totalPrice = Math.round(dayCost * (totalday + 1) * 1.1);

    const bookings = await this.prisma.db.orm.public.Reservations.create({
      ...dto,
      artistId,
      status: 'pending',
      totalPrice,
    });
    return bookings;
  }
}
