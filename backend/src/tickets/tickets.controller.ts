import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { TicketsService } from './tickets.service';
import { BuyTicketDto } from './dto/buy-ticket.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('buy')
  @UseGuards(JwtAuthGuard)
  buyTicket(
    @Req() req: any,
    @Body() dto: BuyTicketDto,
  ) {
    return this.ticketsService.buyTicket(
      req.user.userId,
      dto.raffleId,
    );
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyTickets(@Req() req: any) {
    return this.ticketsService.getMyTickets(req.user.userId);
  }
}
