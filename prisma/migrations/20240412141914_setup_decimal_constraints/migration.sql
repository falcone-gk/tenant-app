/*
  Warnings:

  - You are about to alter the column `amount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(9,2)`.
  - You are about to alter the column `amountPaid` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(9,2)`.
  - You are about to alter the column `debt` on the `tenants` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(9,2)`.
  - You are about to alter the column `amount` on the `total_payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(9,2)`.

*/
-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(9,2),
ALTER COLUMN "amountPaid" SET DATA TYPE DECIMAL(9,2);

-- AlterTable
ALTER TABLE "tenants" ALTER COLUMN "debt" SET DATA TYPE DECIMAL(9,2);

-- AlterTable
ALTER TABLE "total_payments" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(9,2);
