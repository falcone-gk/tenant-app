/*
  Warnings:

  - The `consume` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "consume",
ADD COLUMN     "consume" INTEGER;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "unit" TEXT NOT NULL DEFAULT '';
