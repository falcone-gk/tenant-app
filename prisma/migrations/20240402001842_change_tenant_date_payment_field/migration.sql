/*
  Warnings:

  - You are about to drop the column `date_to_pay` on the `tenants` table. All the data in the column will be lost.
  - Added the required column `day_to_pay` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "date_to_pay",
ADD COLUMN     "day_to_pay" INTEGER NOT NULL;
