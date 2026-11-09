import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // GET /booking — 인증된 사용자 ID로 내 예약 목록 조회
  @Get()
  @UseGuards(AuthGuard)
  myBooking(@Req() req) {
    return this.bookingService.myBooking(req.user.id);
  }

  // POST /booking — 로그인한 사용자의 예약 생성
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  Booking(@Req() req, @Body() body: CreateBookingDto) {
    return this.bookingService.Booking(req.user.id, body);
  }
}
