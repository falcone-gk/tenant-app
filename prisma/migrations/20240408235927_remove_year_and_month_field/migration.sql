/*
  Warnings:

  - You are about to drop the column `month` on the `total_payments` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `total_payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "total_payments" DROP COLUMN "month",
DROP COLUMN "year";
