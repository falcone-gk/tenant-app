/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `tenants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floor` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "floor" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tenants_code_key" ON "tenants"("code");
