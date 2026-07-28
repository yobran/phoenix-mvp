import {
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SubmitTransactionDto {
  @IsString()
  @MinLength(3)
  paymentMessage!: string;

  @IsOptional()
  @IsString()
  transactionCode?: string;
}
