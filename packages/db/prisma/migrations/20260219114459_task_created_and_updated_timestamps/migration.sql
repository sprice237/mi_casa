-- AlterTable
ALTER TABLE "RecurringTask" ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ;

update "RecurringTask" set "updatedAt" = "createdAt";

ALTER TABLE "RecurringTask" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ;

update "Task" set "updatedAt" = "createdAt";

ALTER TABLE "Task" ALTER COLUMN "updatedAt" SET NOT NULL;
