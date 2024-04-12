/*
  Warnings:

  - You are about to drop the column `paidMount` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paidMount",
ADD COLUMN     "amountPaid" DECIMAL(65,30) NOT NULL DEFAULT 0;
