-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "thumbnailBucketKey" TEXT,
ADD COLUMN     "thumbnailIsReady" BOOLEAN,
ADD COLUMN     "thumbnailMimeType" TEXT;
