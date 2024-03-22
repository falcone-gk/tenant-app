/*
  Warnings:

  - You are about to drop the column `tenant_user_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_user_id` on the `tenant_user_debts` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_user_id` on the `tenants` table. All the data in the column will be lost.
  - Added the required column `tenant_id` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `tenant_user_debts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_tenant_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tenant_user_debts" DROP CONSTRAINT "tenant_user_debts_tenant_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_tenant_user_id_fkey";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "tenant_user_id",
ADD COLUMN     "tenant_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tenant_user_debts" DROP COLUMN "tenant_user_id",
ADD COLUMN     "tenant_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "tenant_user_id",
ADD COLUMN     "tenant_id" INTEGER;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_user_debts" ADD CONSTRAINT "tenant_user_debts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
