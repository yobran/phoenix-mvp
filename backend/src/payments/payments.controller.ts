import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { SubmitTransactionDto } from './dto/submit-transaction.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findPayment(id);
  }

  @Post(':id/submit-code')
  @UseGuards(JwtAuthGuard)
  submitCode(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: SubmitTransactionDto,
  ) {
    return this.paymentsService.submitTransactionCode(
      id,
      req.user.userId,
      dto,
    );
  }

  @Get('pending/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getPendingPayments() {
    return this.paymentsService.getPendingPayments();
  }

  @Post(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  verifyPayment(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: VerifyPaymentDto,
  ) {
    return this.paymentsService.verifyPayment(
      id,
      req.user.userId,
      dto,
    );
  }
}
