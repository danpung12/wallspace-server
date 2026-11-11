import { IsDateString, IsUUID, Matches } from 'class-validator';

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

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

  @Matches(DATE_ONLY)
  @IsDateString({ strict: true })
  startDate!: string;

  @Matches(DATE_ONLY)
  @IsDateString({ strict: true })
  endDate!: string;
}
