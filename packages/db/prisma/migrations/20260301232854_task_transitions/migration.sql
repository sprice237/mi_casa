-- CreateTable
CREATE TABLE "TaskTransition" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "casaId" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "userId" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prevStatus" "TaskStatus",
    "nextStatus" "TaskStatus" NOT NULL,

    CONSTRAINT "TaskTransition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskTransition" ADD CONSTRAINT "TaskTransition_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskTransition" ADD CONSTRAINT "TaskTransition_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskTransition" ADD CONSTRAINT "TaskTransition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
