import { IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class StkPushDto {
  @IsPhoneNumber('KE')
  phone!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  accountReference!: string;

  @IsString()
  transactionDesc!: string;
}
