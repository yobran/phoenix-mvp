import { IsString, Length } from 'class-validator';

export class SubmitTransactionDto {
  @IsString()
  @Length(8, 20)
  transactionCode!: string;
}
