import { Module } from '@nestjs/common';
import { DarajaService } from './daraja.service';

@Module({
  providers: [DarajaService]
})
export class DarajaModule {}
