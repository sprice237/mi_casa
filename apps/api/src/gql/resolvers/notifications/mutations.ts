import { AppResolvers } from "../types.js";

export const reportExpoNotificationTokenResolver: AppResolvers['Mutation']['reportExpoNotificationToken'] = async (_, { input }, { db, jwt, casaId }) => {
  await db.$transaction(async tx => {
    if (await tx.expoNotificationToken.findFirst({
      where: {
        userId: jwt.sub,
        deviceId: input.deviceId,
        casaId,
        platform: input.platform,
        expoPushToken: input.expoPushTokenToken
      },
      select: {
        id: true
      }
    })) {
      return;
    }

    await tx.expoNotificationToken.deleteMany({
      where: {
        OR: [
          { deviceId: input.deviceId },
          { expoPushToken: input.expoPushTokenToken }
        ]
      }
    });

    await tx.expoNotificationToken.create({
      data: {
        userId: jwt.sub,
        deviceId: input.deviceId,
        casaId,
        platform: input.platform,
        expoPushToken: input.expoPushTokenToken
      },
    })
  })

  return true;
};