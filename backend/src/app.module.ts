import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RafflesModule } from './raffles/raffles.module';
import { TicketsModule } from './tickets/tickets.module';
import { PaymentsModule } from './payments/payments.module';
import { DarajaModule } from './daraja/daraja.module';
import { WinnersModule } from './winners/winners.module';
import { MpesaModule } from './mpesa/mpesa.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    UsersModule,
    PrismaModule,
    AuthModule,
    RafflesModule,
    TicketsModule,
    PaymentsModule,
    DarajaModule,
    WinnersModule,
    MpesaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
