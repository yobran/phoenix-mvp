import {
  IsString,
  IsNumber,
  IsInt,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateRaffleDto {
  @IsString()
  title!: string;

  @IsString()
  prize!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(1)
  ticketPrice!: number;

  @IsInt()
  @Min(1)
  totalTickets!: number;

  @IsDateString()
  drawDate!: string;
}
