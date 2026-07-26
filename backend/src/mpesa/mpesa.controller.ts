import { Body, Controller, Get, Post } from '@nestjs/common';

import { MpesaService } from './mpesa.service';
import { StkPushDto } from './dto/stk-push.dto';

@Controller('mpesa')
export class MpesaController {
  constructor(
    private readonly mpesaService: MpesaService,
  ) {}

  @Get('token')
  async token() {
    return {
      accessToken: await this.mpesaService.getAccessToken(),
    };
  }

  @Post('stk-push')
  async stkPush(
    @Body() dto: StkPushDto,
  ) {
    return this.mpesaService.stkPush(dto);
  }
}
