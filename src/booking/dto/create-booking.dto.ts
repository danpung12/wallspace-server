import { IsDateString, IsUUID } from 'class-validator';

/**
 * 예약 생성 요청
 *
 * - locationId: 가게 ID
 * - spaceId: 공간 ID
 * - artworkId: 작품 ID
 * - startDate: 예약 시작일
 * - endDate: 예약 종료일
 */
export class CreateBookingDto {
  @IsUUID()
  locationId!: string;

  @IsUUID()
  spaceId!: string;

  @IsUUID()
  artworkId!: string;

  @IsDateString({ strict: true })
  startDate!: string;

  @IsDateString({ strict: true })
  endDate!: string;
}
