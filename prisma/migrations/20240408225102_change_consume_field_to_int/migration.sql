/*
  Warnings:

  - Changed the type of `consume` on the `total_payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "total_payments" DROP COLUMN "consume",
ADD COLUMN     "consume" INTEGER NOT NULL;
