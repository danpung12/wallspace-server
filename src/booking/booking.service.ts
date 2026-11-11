import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { randomUUID } from 'crypto';

dayjs.extend(isBetween);

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

  // 본인 작품과 날짜별 공간 정원을 확인하고 대기 상태의 예약을 생성한다.
  // 1. 공간의 존재 여부, 가게 일치 여부와 요금 설정을 확인한다.
  // 2. 예약할 작품이 로그인한 사용자의 작품인지 확인한다.
  // 3. 날짜 순서를 확인하고 이용 일수와 수수료를 반영해 총액을 계산한다.
  // 4. 취소되지 않은 기존 예약을 조회해 신청 기간의 날짜별 정원을 확인한다.
  // 5. 검증을 통과하면 인증된 사용자의 예약을 pending 상태로 저장한다.
  async Booking(artistId: string, dto: CreateBookingDto) {
    const space = await this.prisma.db.orm.public.Spaces.where({
      id: dto.spaceId,
    }).first();

    if (!space) {
      throw new NotFoundException('공간을 찾을 수 없습니다');
    }

    if (space.locationId !== dto.locationId) {
      throw new ConflictException('공간이 일치하지 않습니다');
    }

    if (space.price === null) {
      throw new NotAcceptableException('요금이 Null 입니다');
    }

    const artist = await this.prisma.db.orm.public.Artworks.where({
      id: dto.artworkId,
    })
      .select('artistId')
      .first();

    // 작품이 없거나 다른 사람 소유인 경우 모두 예약을 막는다.
    if (artistId !== artist?.artistId) {
      throw new NotFoundException('해당 예약의 작가가 아닙니다.');
    }

    const dayCost = Number(space.price);

    const totalday = dayjs(dto.endDate).diff(dto.startDate, 'day');

    if (totalday < 0) {
      throw new BadRequestException('날짜가 잘못되었습니다.');
    }

    // 시작일과 종료일을 모두 포함하고, 수수료 10%를 더한 총액을 원 단위로 반올림한다.
    const totalPrice = Math.round(dayCost * (totalday + 1) * 1.1);

    // 같은 공간에서 신청 기간과 하루라도 겹치는 예약을 가져오고, 취소된 예약은 제외한다.
    const booking = await this.prisma.db.orm.public.Reservations.where({
      spaceId: dto.spaceId,
    })
      .where((b) => b.startDate.lte(dto.endDate))
      .where((b) => b.endDate.gte(dto.startDate))
      .where((b) => b.status.neq('cancelled'))
      .all();

    // 예약마다 겹치는 날짜가 다르므로, 전체 예약 수가 아닌 하루별 예약 수를 확인한다.
    for (let i = 0; i <= totalday; i++) {
      const date = dayjs(dto.startDate).add(i, 'day');

      // 예약 1건은 작품 1개이며, 시작일과 종료일도 자리를 차지하므로 '[]'로 포함한다.
      const count = booking.filter((b) =>
        date.isBetween(b.startDate, b.endDate, 'day', '[]'),
      ).length;

      if (count >= space.maxArtworks) {
        throw new ConflictException('예약 가능한 자리가 없습니다.');
      }
    }

    // 검증을 통과한 예약을 결제용 주문번호와 함께 대기 상태로 저장한다.
    const bookings = await this.prisma.db.orm.public.Reservations.create({
      ...dto,
      artistId,
      status: 'pending',
      totalPrice,
      orderId: randomUUID(),
    });
    return bookings;
  }
}
