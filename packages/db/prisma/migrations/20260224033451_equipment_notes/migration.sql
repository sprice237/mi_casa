-- CreateTable
CREATE TABLE "EquipmentNote" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipmentId" UUID NOT NULL,

    CONSTRAINT "EquipmentNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EquipmentNote_equipmentId_createdAt_idx" ON "EquipmentNote"("equipmentId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "EquipmentNote" ADD CONSTRAINT "EquipmentNote_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
