/*
  Warnings:

  - You are about to drop the `tenant_debts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tenant_debts" DROP CONSTRAINT "tenant_debts_tenant_id_fkey";

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "debt" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "tenant_debts";

-- DropEnum
DROP TYPE "Month";
