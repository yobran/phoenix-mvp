import { Controller, Get, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findPayment(id);
  }
}
