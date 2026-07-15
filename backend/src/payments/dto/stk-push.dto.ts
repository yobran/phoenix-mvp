import { IsString } from 'class-validator';

export class StkPushDto {
  @IsString()
  phone!: string;

  @IsString()
  paymentId!: string;
}
