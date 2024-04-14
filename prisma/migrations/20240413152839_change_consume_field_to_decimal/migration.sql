/*
  Warnings:

  - You are about to alter the column `consume` on the `total_payments` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(9,2)`.

*/
-- AlterTable
ALTER TABLE "total_payments" ALTER COLUMN "consume" SET DATA TYPE DECIMAL(9,2);
