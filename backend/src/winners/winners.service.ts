import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WinnersService {
  constructor(private readonly prisma: PrismaService) {}

  async drawWinner(raffleId: string) {
    const raffle = await this.prisma.raffle.findUnique({
      where: { id: raffleId },
    });

    if (!raffle) {
      throw new NotFoundException('Raffle not found');
    }

    if (raffle.status !== 'ACTIVE') {
      throw new BadRequestException(
        'Only ACTIVE raffles can be drawn',
      );
    }

    const existingWinner =
      await this.prisma.winner.findUnique({
        where: {
          raffleId,
        },
      });

    if (existingWinner) {
      throw new BadRequestException(
        'Winner already exists for this raffle',
      );
    }

    const verifiedPayments =
      await this.prisma.payment.findMany({
        where: {
          raffleId,
          status: 'VERIFIED',
        },
        include: {
          user: true,
          ticket: true,
        },
      });

    if (verifiedPayments.length === 0) {
      throw new BadRequestException(
        'No verified tickets found',
      );
    }

    const randomWinner =
      verifiedPayments[
        Math.floor(
          Math.random() * verifiedPayments.length,
        )
      ];

    const winner = await this.prisma.$transaction(
      async (tx) => {
        const created = await tx.winner.create({
          data: {
            raffleId,
            ticketId: randomWinner.ticketId,
            userId: randomWinner.userId,
          },
        });

        await tx.raffle.update({
          where: {
            id: raffleId,
          },
          data: {
            status: 'COMPLETED',
          },
        });

        return created;
      },
    );

    return this.prisma.winner.findUnique({
      where: {
        id: winner.id,
      },
      include: {
        raffle: true,
        ticket: true,
        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            referralCode: true,
          },
        },
      },
    });
  }

  async getWinner(raffleId: string) {
    return this.prisma.winner.findUnique({
      where: {
        raffleId,
      },
      include: {
        raffle: true,
        ticket: true,
        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            referralCode: true,
          },
        },
      },
    });
  }

  async getAllWinners() {
    return this.prisma.winner.findMany({
      include: {
        raffle: true,
        ticket: true,
        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            referralCode: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}