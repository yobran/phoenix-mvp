import { Module } from '@nestjs/common';

import { WinnersController } from './winners.controller';
import { WinnersService } from './winners.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WinnersController],
  providers: [WinnersService],
})
export class WinnersModule {}
