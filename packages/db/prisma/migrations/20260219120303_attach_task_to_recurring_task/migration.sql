-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "recurringTaskId" UUID;

-- CreateIndex
CREATE INDEX "Task_recurringTaskId_createdAt_idx" ON "Task"("recurringTaskId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_recurringTaskId_fkey" FOREIGN KEY ("recurringTaskId") REFERENCES "RecurringTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;
