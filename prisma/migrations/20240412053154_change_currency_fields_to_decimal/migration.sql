-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "paidMount" SET DEFAULT 0,
ALTER COLUMN "paidMount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "total_payments" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);
