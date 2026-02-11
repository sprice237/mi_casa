-- AlterTable
ALTER TABLE "RecurringTask" ADD COLUMN     "startDate" DATE;

-- default existing rows to 2026-01-01, it doesn't really matter
UPDATE "RecurringTask" SET "startDate" = '2026-01-01';

ALTER TABLE "RecurringTask" ALTER COLUMN "startDate" SET NOT NULL;
