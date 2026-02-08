-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('COMPLETE', 'IN_PROGRESS', 'READY_TO_BEGIN');

-- CreateTable
CREATE TABLE "Task" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
