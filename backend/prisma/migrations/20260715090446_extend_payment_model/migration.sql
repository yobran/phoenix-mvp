/*
  Warnings:

  - A unique constraint covering the columns `[transactionCode]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MANUAL', 'STK_PUSH');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "checkoutRequestId" TEXT,
ADD COLUMN     "merchantRequestId" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "transactionCode" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedBy" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionCode_key" ON "Payment"("transactionCode");
