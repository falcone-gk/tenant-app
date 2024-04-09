/*
  Warnings:

  - Added the required column `year` to the `total_payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "total_payments" ADD COLUMN     "year" INTEGER NOT NULL;
