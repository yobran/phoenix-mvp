import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { WinnersService } from './winners.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('winners')
export class WinnersController {
  constructor(
    private readonly winnersService: WinnersService,
  ) {}

  @Get()
  getAll() {
    return this.winnersService.getAllWinners();
  }

  @Get(':raffleId')
  getWinner(@Param('raffleId') raffleId: string) {
    return this.winnersService.getWinner(raffleId);
  }

  @Post(':raffleId/draw')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  drawWinner(
    @Param('raffleId') raffleId: string,
  ) {
    return this.winnersService.drawWinner(raffleId);
  }
}
