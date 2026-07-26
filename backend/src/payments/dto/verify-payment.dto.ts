import { IsEnum } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class VerifyPaymentDto {
  @IsEnum(PaymentStatus)
  status!: PaymentStatus;
}
