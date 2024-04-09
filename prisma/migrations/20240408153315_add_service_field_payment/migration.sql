/*
  Warnings:

  - Added the required column `serviceId` to the `total_payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "total_payments" ADD COLUMN     "serviceId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "total_payments" ADD CONSTRAINT "total_payments_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
