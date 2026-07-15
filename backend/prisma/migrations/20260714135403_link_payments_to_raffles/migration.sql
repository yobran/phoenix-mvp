/*
  Warnings:

  - Added the required column `raffleId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "raffleId" TEXT NOT NULL,
ALTER COLUMN "mpesaReference" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
