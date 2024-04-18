/*
  Warnings:

  - Made the column `record_light` on table `rooms` required. This step will fail if there are existing NULL values in that column.
  - Made the column `record_water` on table `rooms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "rooms" ALTER COLUMN "record_light" SET NOT NULL,
ALTER COLUMN "record_water" SET NOT NULL;
