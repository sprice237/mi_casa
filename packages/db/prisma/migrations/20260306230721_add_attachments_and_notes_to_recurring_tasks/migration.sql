-- CreateTable
CREATE TABLE "_AttachmentToRecurringTask" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AttachmentToRecurringTask_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_NoteToRecurringTask" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_NoteToRecurringTask_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AttachmentToRecurringTask_B_index" ON "_AttachmentToRecurringTask"("B");

-- CreateIndex
CREATE INDEX "_NoteToRecurringTask_B_index" ON "_NoteToRecurringTask"("B");

-- AddForeignKey
ALTER TABLE "_AttachmentToRecurringTask" ADD CONSTRAINT "_AttachmentToRecurringTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Attachment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttachmentToRecurringTask" ADD CONSTRAINT "_AttachmentToRecurringTask_B_fkey" FOREIGN KEY ("B") REFERENCES "RecurringTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoteToRecurringTask" ADD CONSTRAINT "_NoteToRecurringTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoteToRecurringTask" ADD CONSTRAINT "_NoteToRecurringTask_B_fkey" FOREIGN KEY ("B") REFERENCES "RecurringTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
