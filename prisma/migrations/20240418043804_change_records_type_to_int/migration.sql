/*
  Warnings:

  - You are about to alter the column `record_light` on the `rooms` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,2)` to `Integer`.
  - You are about to alter the column `record_water` on the `rooms` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "rooms" ALTER COLUMN "record_light" SET DEFAULT 0,
ALTER COLUMN "record_light" SET DATA TYPE INTEGER,
ALTER COLUMN "record_water" SET DEFAULT 0,
ALTER COLUMN "record_water" SET DATA TYPE INTEGER;
