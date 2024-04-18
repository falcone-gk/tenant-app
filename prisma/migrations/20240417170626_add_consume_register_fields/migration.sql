/*
  Warnings:

  - You are about to drop the column `lastRegister` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "lastRegister";

-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "record_light" DECIMAL(9,2),
ADD COLUMN     "record_water" DECIMAL(9,2);
