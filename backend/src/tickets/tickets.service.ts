import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async expireStaleReservations() {
    const now = new Date();

    await this.prisma.$transaction(async (tx) => {
      const expiredPayments = await tx.payment.findMany({
        where: {
          status: 'PENDING',
          expiresAt: {
            lt: now,
          },
          ticket: {
            status: 'RESERVED',
          },
        },
        select: {
          id: true,
          ticketId: true,
        },
      });

      if (expiredPayments.length === 0) {
        return;
      }

      await tx.payment.updateMany({
        where: {
          id: {
            in: expiredPayments.map(
              (payment) => payment.id,
            ),
          },
        },
        data: {
          status: 'EXPIRED',
        },
      });

      await tx.ticket.updateMany({
        where: {
          id: {
            in: expiredPayments.map(
              (payment) => payment.ticketId,
            ),
          },
        },
        data: {
          status: 'CANCELLED',
        },
      });
    });
  }

  async buyTicket(userId: string, raffleId: string) {
    await this.expireStaleReservations();

    const raffle = await this.prisma.raffle.findUnique({
      where: { id: raffleId },
    });

    if (!raffle) {
      throw new NotFoundException('Raffle not found');
    }

    if (raffle.status !== 'ACTIVE') {
      throw new BadRequestException(
        'Raffle is not active',
      );
    }

    if (raffle.soldTickets >= raffle.totalTickets) {
      throw new BadRequestException(
        'Tickets are sold out',
      );
    }

    const ticketNumber =
      'PHX-' +
      Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

    const expiresAt = new Date(
      Date.now() + 15 * 60 * 1000,
    );

    const result = await this.prisma.$transaction(
      async (tx) => {
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
            expiresAt,
          },
        });

        return { ticket, payment };
      },
    );

    return {
      message:
        'Ticket reserved. Complete payment within 15 minutes.',
      ...result,
    };
  }

  async getMyTickets(userId: string) {
    await this.expireStaleReservations();

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