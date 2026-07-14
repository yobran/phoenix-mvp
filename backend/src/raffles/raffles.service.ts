import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRaffleDto } from './dto/create-raffle.dto';

@Injectable()
export class RafflesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateRaffleDto) {
    return this.prisma.raffle.create({
      data: {
        title: dto.title,
        description: dto.description,
        prize: dto.prize,
        ticketPrice: dto.ticketPrice,
        totalTickets: dto.totalTickets,
        drawDate: new Date(dto.drawDate),
      },
    });
  }

  findAll() {
    return this.prisma.raffle.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
