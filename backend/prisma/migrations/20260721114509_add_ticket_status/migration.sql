-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('RESERVED', 'SOLD', 'CANCELLED');

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "status" "TicketStatus" NOT NULL DEFAULT 'RESERVED';
