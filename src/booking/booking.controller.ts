import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // GET /booking — 인증된 사용자 ID로 내 예약 목록 조회
  @Get()
  @UseGuards(AuthGuard)
  myBooking(@Req() req) {
    return this.bookingService.myBooking(req.user.id);
  }
}
