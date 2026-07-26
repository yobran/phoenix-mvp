import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';

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

  async findOne(id: string) {
    const raffle = await this.prisma.raffle.findUnique({
      where: { id },
    });

    if (!raffle) {
      throw new NotFoundException('Raffle not found');
    }

    return raffle;
  }

  async update(id: string, dto: UpdateRaffleDto) {
    await this.findOne(id);

    return this.prisma.raffle.update({
      where: { id },
      data: {
        ...dto,
        drawDate: dto.drawDate ? new Date(dto.drawDate) : undefined,
      },
    });
  }

  async activate(id: string) {
    await this.findOne(id);

    return this.prisma.raffle.update({
      where: { id },
      data: {
        status: 'ACTIVE',
      },
    });
  }

  async complete(id: string) {
    await this.findOne(id);

    return this.prisma.raffle.update({
      where: { id },
      data: {
        status: 'COMPLETED',
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.raffle.delete({
      where: { id },
    });
  }
}
