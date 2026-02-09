-- CreateTable
CREATE TABLE "RecurringTask" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "rule" JSONB NOT NULL,

    CONSTRAINT "RecurringTask_pkey" PRIMARY KEY ("id")
);
