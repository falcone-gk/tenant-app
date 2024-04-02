/*
  Warnings:

  - You are about to drop the column `created_at` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `paid_at` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `tenants` table. All the data in the column will be lost.
  - Added the required column `room_id` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_to_pay` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Month" AS ENUM ('ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE');

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "created_at",
DROP COLUMN "paid_at",
ADD COLUMN     "consume" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "date_to_pay" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "last_date_paid" TIMESTAMP(3),
ADD COLUMN     "paidMount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "room_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "created_at",
ADD COLUMN     "date_to_pay" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "join_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "token" SET DEFAULT '';

-- CreateTable
CREATE TABLE "total_payments" (
    "id" SERIAL NOT NULL,
    "month" "Month" NOT NULL,
    "registerDate" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "consume" TEXT NOT NULL DEFAULT '',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "outageDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "total_payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
