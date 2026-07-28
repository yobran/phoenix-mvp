import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { SubmitTransactionDto } from './dto/submit-transaction.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPayment(
    id: string,
    userId: string,
    role: string,
  ) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        user: true,
        ticket: true,
        raffle: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (
      role !== 'ADMIN' &&
      payment.userId !== userId
    ) {
      throw new ForbiddenException(
        'You do not have permission to view this payment',
      );
    }

    return payment;
  }

  async submitTransactionCode(
    id: string,
    userId: string,
    dto: SubmitTransactionDto,
  ) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        ticket: true,
        raffle: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.userId !== userId) {
      throw new ForbiddenException(
        'You do not own this payment',
      );
    }

    if (payment.status !== 'PENDING') {
      throw new BadRequestException(
        'Payment is no longer pending',
      );
    }

    if (payment.ticket.status === 'CANCELLED') {
      throw new BadRequestException(
        'This ticket has expired',
      );
    }

    if (payment.raffle.status !== 'ACTIVE') {
      throw new BadRequestException(
        'This raffle is no longer active',
      );
    }

    if (
      payment.expiresAt &&
      payment.expiresAt < new Date()
    ) {
      throw new BadRequestException(
        'This payment has expired',
      );
    }

    return this.prisma.payment.update({
      where: { id },
      data: {
        paymentMessage: dto.paymentMessage,
        transactionCode: dto.transactionCode || null,
      },
    });
  }

  async getPendingPayments() {
    return this.prisma.payment.findMany({
      where: {
        status: 'PENDING',
        transactionCode: {
          not: null,
        },
      },
      include: {
        user: true,
        ticket: true,
        raffle: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async verifyPayment(
    id: string,
    adminId: string,
    dto: VerifyPaymentDto,
  ) {
    const payment =
      await this.prisma.payment.findUnique({
        where: { id },
        include: {
          ticket: true,
          raffle: true,
        },
      });

    if (!payment) {
      throw new NotFoundException(
        'Payment not found',
      );
    }

    if (payment.status !== 'PENDING') {
      throw new BadRequestException(
        'Payment already processed',
      );
    }

    if (
      dto.status !== 'VERIFIED' &&
      dto.status !== 'REJECTED'
    ) {
      throw new BadRequestException(
        'Invalid payment status',
      );
    }

    if (
      dto.status === 'VERIFIED' &&
      payment.ticket.status === 'CANCELLED'
    ) {
      throw new BadRequestException(
        'Cannot verify payment for an expired ticket',
      );
    }

    return this.prisma.$transaction(
      async (tx) => {
        const updatedPayment =
          await tx.payment.update({
            where: { id },
            data: {
              status: dto.status,
              verifiedAt:
                dto.status === 'VERIFIED'
                  ? new Date()
                  : null,
              verifiedBy:
                dto.status === 'VERIFIED'
                  ? adminId
                  : null,
            },
          });

        if (dto.status === 'VERIFIED') {
          await tx.ticket.update({
            where: {
              id: payment.ticket.id,
            },
            data: {
              status: 'SOLD',
            },
          });

          await tx.raffle.update({
            where: {
              id: payment.ticket.raffleId,
            },
            data: {
              soldTickets: {
                increment: 1,
              },
            },
          });
        }

        return updatedPayment;
      },
    );
  }
}