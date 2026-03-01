ALTER TABLE "Equipment" ADD COLUMN     "casaId" UUID;
ALTER TABLE "EquipmentAttachment" ADD COLUMN     "casaId" UUID;
ALTER TABLE "EquipmentNote" ADD COLUMN     "casaId" UUID;
ALTER TABLE "Project" ADD COLUMN     "casaId" UUID;
ALTER TABLE "RecurringTask" ADD COLUMN     "casaId" UUID;
ALTER TABLE "Task" ADD COLUMN     "casaId" UUID;
ALTER TABLE "User" ADD COLUMN     "casaId" UUID;

-- CreateTable
CREATE TABLE "Casa" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Casa_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Casa" ("id", "name") VALUES ('6b21a452-1cd7-4506-ba01-189c107a6700', 'Mi Casa');

UPDATE "Equipment" SET "casaId" = '6b21a452-1cd7-4506-ba01-189c107a6700';
UPDATE "EquipmentAttachment" SET "casaId" = '6b21a452-1cd7-4506-ba01-189c107a6700';
UPDATE "EquipmentNote" SET "casaId" = '6b21a452-1cd7-4506-ba01-189c107a6700';
UPDATE "Project" SET "casaId" = '6b21a452-1cd7-4506-ba01-189c107a6700';
UPDATE "RecurringTask" SET "casaId" = '6b21a452-1cd7-4506-ba01-189c107a6700';
UPDATE "Task" SET "casaId" = '6b21a452-1cd7-4506-ba01-189c107a6700';
UPDATE "User" SET "casaId" = '6b21a452-1cd7-4506-ba01-189c107a6700';

ALTER TABLE "Equipment" ALTER COLUMN     "casaId" SET NOT NULL;
ALTER TABLE "EquipmentAttachment" ALTER COLUMN     "casaId" SET NOT NULL;
ALTER TABLE "EquipmentNote" ALTER COLUMN     "casaId" SET NOT NULL;
ALTER TABLE "Project" ALTER COLUMN     "casaId" SET NOT NULL;
ALTER TABLE "RecurringTask" ALTER COLUMN     "casaId" SET NOT NULL;
ALTER TABLE "Task" ALTER COLUMN     "casaId" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN     "casaId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentAttachment" ADD CONSTRAINT "EquipmentAttachment_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentNote" ADD CONSTRAINT "EquipmentNote_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTask" ADD CONSTRAINT "RecurringTask_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
