import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async buyTicket(userId: string, raffleId: string) {
    const raffle = await this.prisma.raffle.findUnique({
      where: { id: raffleId },
    });

    if (!raffle) {
      throw new NotFoundException('Raffle not found');
    }

    if (raffle.status !== 'ACTIVE') {
      throw new BadRequestException('Raffle is not active');
    }

    if (raffle.soldTickets >= raffle.totalTickets) {
      throw new BadRequestException('Tickets are sold out');
    }

    const ticketNumber =
      'PHX-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const result = await this.prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.create({
        data: {
          ticketNumber,
          userId,
          raffleId,
        },
      });

      const payment = await tx.payment.create({
        data: {
          amount: raffle.ticketPrice,
          userId,
          raffleId,
          ticketId: ticket.id,
        },
      });

      await tx.raffle.update({
        where: { id: raffleId },
        data: {
          soldTickets: {
            increment: 1,
          },
        },
      });

      return { ticket, payment };
    });

    return {
      message: 'Ticket purchased successfully',
      ...result,
    };
  }

  async getMyTickets(userId: string) {
    return this.prisma.ticket.findMany({
      where: {
        userId,
      },
      include: {
        raffle: true,
        payment: true,
      },
      orderBy: {
        ticketNumber: 'desc',
      },
    });
  }
}
