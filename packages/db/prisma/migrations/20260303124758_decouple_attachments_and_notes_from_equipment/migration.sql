-- DropForeignKey
ALTER TABLE "EquipmentAttachment" DROP CONSTRAINT "EquipmentAttachment_casaId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentAttachment" DROP CONSTRAINT "EquipmentAttachment_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentNote" DROP CONSTRAINT "EquipmentNote_casaId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentNote" DROP CONSTRAINT "EquipmentNote_equipmentId_fkey";

-- CreateTable
CREATE TABLE "Attachment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "casaId" UUID NOT NULL,
    "bucketKey" TEXT NOT NULL,
    "isReady" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "casaId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AttachmentToEquipment" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AttachmentToEquipment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EquipmentToNote" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_EquipmentToNote_AB_pkey" PRIMARY KEY ("A","B")
);

INSERT INTO "Attachment" ("id", "casaId", "bucketKey", "isReady", "createdAt", "updatedAt")
SELECT "id", "casaId", "bucketKey", "isReady", "createdAt", "updatedAt"
FROM "EquipmentAttachment";

INSERT INTO "_AttachmentToEquipment" ("A", "B")
SELECT "id", "equipmentId"
FROM "EquipmentAttachment";


INSERT INTO "Note" ("id", "casaId", "content", "createdAt")
SELECT "id", "casaId", "content", "createdAt"
FROM "EquipmentNote";

INSERT INTO "_EquipmentToNote" ("A", "B")
SELECT "equipmentId", "id"
FROM "EquipmentNote";

-- DropTable
DROP TABLE "EquipmentAttachment";

-- DropTable
DROP TABLE "EquipmentNote";



-- CreateIndex
CREATE INDEX "Attachment_casaId_idx" ON "Attachment"("casaId");

-- CreateIndex
CREATE INDEX "_AttachmentToEquipment_B_index" ON "_AttachmentToEquipment"("B");

-- CreateIndex
CREATE INDEX "_EquipmentToNote_B_index" ON "_EquipmentToNote"("B");

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttachmentToEquipment" ADD CONSTRAINT "_AttachmentToEquipment_A_fkey" FOREIGN KEY ("A") REFERENCES "Attachment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttachmentToEquipment" ADD CONSTRAINT "_AttachmentToEquipment_B_fkey" FOREIGN KEY ("B") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentToNote" ADD CONSTRAINT "_EquipmentToNote_A_fkey" FOREIGN KEY ("A") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentToNote" ADD CONSTRAINT "_EquipmentToNote_B_fkey" FOREIGN KEY ("B") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
