-- CreateEnum
CREATE TYPE "ExpoNotificationPlatform" AS ENUM ('ANDROID', 'IOS');

-- CreateTable
CREATE TABLE "ExpoNotificationToken" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "deviceId" TEXT NOT NULL,
    "casaId" UUID NOT NULL,
    "platform" "ExpoNotificationPlatform" NOT NULL,
    "expoPushToken" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExpoNotificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExpoNotificationToken_userId_idx" ON "ExpoNotificationToken"("userId");

-- CreateIndex
CREATE INDEX "ExpoNotificationToken_casaId_idx" ON "ExpoNotificationToken"("casaId");

-- CreateIndex
CREATE UNIQUE INDEX "ExpoNotificationToken_deviceId_key" ON "ExpoNotificationToken"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "ExpoNotificationToken_expoPushToken_key" ON "ExpoNotificationToken"("expoPushToken");

-- AddForeignKey
ALTER TABLE "ExpoNotificationToken" ADD CONSTRAINT "ExpoNotificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpoNotificationToken" ADD CONSTRAINT "ExpoNotificationToken_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
