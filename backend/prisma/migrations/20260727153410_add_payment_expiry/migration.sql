-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "Raffle" ADD COLUMN     "imageUrl" TEXT;
