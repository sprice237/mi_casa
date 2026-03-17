
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_casaId_fkey";

-- DropForeignKey
ALTER TABLE "_AttachmentToEquipment" DROP CONSTRAINT "_AttachmentToEquipment_A_fkey";

-- DropForeignKey
ALTER TABLE "_AttachmentToEquipment" DROP CONSTRAINT "_AttachmentToEquipment_B_fkey";

-- DropForeignKey
ALTER TABLE "_AttachmentToRecurringTask" DROP CONSTRAINT "_AttachmentToRecurringTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_AttachmentToRecurringTask" DROP CONSTRAINT "_AttachmentToRecurringTask_B_fkey";

-- DropForeignKey
ALTER TABLE "_AttachmentToTask" DROP CONSTRAINT "_AttachmentToTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_AttachmentToTask" DROP CONSTRAINT "_AttachmentToTask_B_fkey";

-- DropForeignKey
ALTER TABLE "_EquipmentToNote" DROP CONSTRAINT "_EquipmentToNote_A_fkey";

-- DropForeignKey
ALTER TABLE "_EquipmentToNote" DROP CONSTRAINT "_EquipmentToNote_B_fkey";

-- DropForeignKey
ALTER TABLE "_NoteToRecurringTask" DROP CONSTRAINT "_NoteToRecurringTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_NoteToRecurringTask" DROP CONSTRAINT "_NoteToRecurringTask_B_fkey";

-- DropForeignKey
ALTER TABLE "_NoteToTask" DROP CONSTRAINT "_NoteToTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_NoteToTask" DROP CONSTRAINT "_NoteToTask_B_fkey";



-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "mimeType" TEXT;
-- so far everything has been a jpeg
UPDATE "Attachment" SET "mimeType" = 'image/jpeg';
ALTER TABLE "Attachment" ALTER COLUMN     "mimeType" SET NOT NULL;


-- CreateTable
CREATE TABLE "ActivityFeed" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "casaId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityFeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityFeedEntry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "casaId" UUID NOT NULL,
    "activityFeedId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID,
    "note" TEXT,

    CONSTRAINT "ActivityFeedEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ActivityFeedEntryToAttachment" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ActivityFeedEntryToAttachment_AB_pkey" PRIMARY KEY ("A","B")
);




-- equipment

INSERT INTO "ActivityFeed" ("id", "casaId", "createdAt")
SELECT "id", "casaId", "createdAt"
FROM "Equipment";

INSERT INTO "ActivityFeedEntry" ("casaId", "activityFeedId", "createdAt", "note")
SELECT "Equipment"."casaId", "Equipment"."id", "Note"."createdAt", "Note"."content"
FROM "Equipment"
JOIN "_EquipmentToNote" ON "_EquipmentToNote"."A" = "Equipment"."id"
JOIN "Note" ON "_EquipmentToNote"."B" = "Note"."id";

INSERT INTO "ActivityFeedEntry" ("id", "casaId", "activityFeedId", "createdAt")
SELECT "Attachment"."id", "Equipment"."casaId", "Equipment"."id", "Attachment"."createdAt"
FROM "Equipment"
JOIN "_AttachmentToEquipment" ON "_AttachmentToEquipment"."B" = "Equipment"."id"
JOIN "Attachment" ON "_AttachmentToEquipment"."A" = "Attachment"."id";

INSERT INTO "_ActivityFeedEntryToAttachment" ("A", "B")
SELECT "Attachment"."id", "Attachment"."id"
FROM "Equipment"
JOIN "_AttachmentToEquipment" ON "_AttachmentToEquipment"."B" = "Equipment"."id"
JOIN "Attachment" ON "_AttachmentToEquipment"."A" = "Attachment"."id";

ALTER TABLE "Equipment" ADD COLUMN     "activityFeedId" UUID;
UPDATE "Equipment" SET "activityFeedId" = "id";
ALTER TABLE "Equipment" ALTER COLUMN     "activityFeedId" SET NOT NULL;


-- recurring tasks

INSERT INTO "ActivityFeed" ("id", "casaId", "createdAt")
SELECT "id", "casaId", "createdAt"
FROM "RecurringTask";

INSERT INTO "ActivityFeedEntry" ("casaId", "activityFeedId", "createdAt", "note")
SELECT "RecurringTask"."casaId", "RecurringTask"."id", "Note"."createdAt", "Note"."content"
FROM "RecurringTask"
JOIN "_NoteToRecurringTask" ON "_NoteToRecurringTask"."B" = "RecurringTask"."id"
JOIN "Note" ON "_NoteToRecurringTask"."A" = "Note"."id";

INSERT INTO "ActivityFeedEntry" ("id", "casaId", "activityFeedId", "createdAt")
SELECT "Attachment"."id", "RecurringTask"."casaId", "RecurringTask"."id", "Attachment"."createdAt"
FROM "RecurringTask"
JOIN "_AttachmentToRecurringTask" ON "_AttachmentToRecurringTask"."B" = "RecurringTask"."id"
JOIN "Attachment" ON "_AttachmentToRecurringTask"."A" = "Attachment"."id";

INSERT INTO "_ActivityFeedEntryToAttachment" ("A", "B")
SELECT "Attachment"."id", "Attachment"."id"
FROM "RecurringTask"
JOIN "_AttachmentToRecurringTask" ON "_AttachmentToRecurringTask"."B" = "RecurringTask"."id"
JOIN "Attachment" ON "_AttachmentToRecurringTask"."A" = "Attachment"."id";

ALTER TABLE "RecurringTask" ADD COLUMN     "activityFeedId" UUID;
UPDATE "RecurringTask" SET "activityFeedId" = "id";
ALTER TABLE "RecurringTask" ALTER COLUMN     "activityFeedId" SET NOT NULL;


-- tasks

INSERT INTO "ActivityFeed" ("id", "casaId", "createdAt")
SELECT "id", "casaId", "createdAt"
FROM "Task";

INSERT INTO "ActivityFeedEntry" ("casaId", "activityFeedId", "createdAt", "note")
SELECT "Task"."casaId", "Task"."id", "Note"."createdAt", "Note"."content"
FROM "Task"
JOIN "_NoteToTask" ON "_NoteToTask"."B" = "Task"."id"
JOIN "Note" ON "_NoteToTask"."A" = "Note"."id";

INSERT INTO "ActivityFeedEntry" ("id", "casaId", "activityFeedId", "createdAt")
SELECT "Attachment"."id", "Task"."casaId", "Task"."id", "Attachment"."createdAt"
FROM "Task"
JOIN "_AttachmentToTask" ON "_AttachmentToTask"."B" = "Task"."id"
JOIN "Attachment" ON "_AttachmentToTask"."A" = "Attachment"."id";

INSERT INTO "_ActivityFeedEntryToAttachment" ("A", "B")
SELECT "Attachment"."id", "Attachment"."id"
FROM "Task"
JOIN "_AttachmentToTask" ON "_AttachmentToTask"."B" = "Task"."id"
JOIN "Attachment" ON "_AttachmentToTask"."A" = "Attachment"."id";

ALTER TABLE "Task" ADD COLUMN     "activityFeedId" UUID;
UPDATE "Task" SET "activityFeedId" = "id";
ALTER TABLE "Task" ALTER COLUMN     "activityFeedId" SET NOT NULL;


-- DropTable
DROP TABLE "Note";

-- DropTable
DROP TABLE "_AttachmentToEquipment";

-- DropTable
DROP TABLE "_AttachmentToRecurringTask";

-- DropTable
DROP TABLE "_AttachmentToTask";

-- DropTable
DROP TABLE "_EquipmentToNote";

-- DropTable
DROP TABLE "_NoteToRecurringTask";

-- DropTable
DROP TABLE "_NoteToTask";


-- CreateIndex
CREATE INDEX "_ActivityFeedEntryToAttachment_B_index" ON "_ActivityFeedEntryToAttachment"("B");

-- AddForeignKey
ALTER TABLE "ActivityFeed" ADD CONSTRAINT "ActivityFeed_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityFeedEntry" ADD CONSTRAINT "ActivityFeedEntry_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityFeedEntry" ADD CONSTRAINT "ActivityFeedEntry_activityFeedId_fkey" FOREIGN KEY ("activityFeedId") REFERENCES "ActivityFeed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityFeedEntry" ADD CONSTRAINT "ActivityFeedEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_activityFeedId_fkey" FOREIGN KEY ("activityFeedId") REFERENCES "ActivityFeed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTask" ADD CONSTRAINT "RecurringTask_activityFeedId_fkey" FOREIGN KEY ("activityFeedId") REFERENCES "ActivityFeed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_activityFeedId_fkey" FOREIGN KEY ("activityFeedId") REFERENCES "ActivityFeed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityFeedEntryToAttachment" ADD CONSTRAINT "_ActivityFeedEntryToAttachment_A_fkey" FOREIGN KEY ("A") REFERENCES "ActivityFeedEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityFeedEntryToAttachment" ADD CONSTRAINT "_ActivityFeedEntryToAttachment_B_fkey" FOREIGN KEY ("B") REFERENCES "Attachment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
