/*
  Warnings:

  - You are about to drop the column `code` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `floor` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the `tenant_user_debts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tenant_users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "tenant_user_debts" DROP CONSTRAINT "tenant_user_debts_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_tenant_id_fkey";

-- DropIndex
DROP INDEX "tenants_code_key";

-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "code",
DROP COLUMN "floor",
DROP COLUMN "reference",
DROP COLUMN "tenant_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" VARCHAR(150) NOT NULL;

-- DropTable
DROP TABLE "tenant_user_debts";

-- DropTable
DROP TABLE "tenant_users";

-- CreateTable
CREATE TABLE "rooms" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "reference" VARCHAR(150) NOT NULL,
    "floor" INTEGER NOT NULL,
    "tenant_id" INTEGER,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_debts" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "last_update" TIMESTAMP(3),
    "tenant_id" INTEGER NOT NULL,

    CONSTRAINT "tenant_debts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_code_key" ON "rooms"("code");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_debts" ADD CONSTRAINT "tenant_debts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
