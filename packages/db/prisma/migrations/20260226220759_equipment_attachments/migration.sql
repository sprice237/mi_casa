-- CreateTable
CREATE TABLE "EquipmentAttachment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bucketKey" TEXT NOT NULL,
    "isReady" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "equipmentId" UUID NOT NULL,

    CONSTRAINT "EquipmentAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EquipmentAttachment_equipmentId_createdAt_idx" ON "EquipmentAttachment"("equipmentId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "EquipmentAttachment" ADD CONSTRAINT "EquipmentAttachment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
