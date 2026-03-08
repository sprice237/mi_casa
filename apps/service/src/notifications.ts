import { PrismaClient } from "@mi_casa/db/client";
import type Expo from "expo-server-sdk";

export async function generateNotifications({ db, expo }: { db: PrismaClient, expo: Expo }) {
  const casas = await db.casa.findMany();

  for (const casa of casas) {
    console.log(`casaId: ${casa.id}`);
    const numIncompleteTasks = await db.task.count({
      where: {
        casaId: casa.id,
        OR: [
          { status: 'READY_TO_BEGIN' },
          { status: 'IN_PROGRESS' },
        ]
      }
    });
    console.log('numIncompleteTasks:', numIncompleteTasks);

    if (numIncompleteTasks === 0) {
      continue;
    }

    const expoNotificationTokens = await db.expoNotificationToken.findMany({
      where: {
        casaId: casa.id
      }
    });

    console.log('expoNotificationTokens.length:', expoNotificationTokens.length);

    if (!expoNotificationTokens.length) {
      continue;
    }

    const messages = expoNotificationTokens.map(expoNotificationToken => ({
      to: expoNotificationToken.expoPushToken,
      title: 'Good morning from Mi Casa!',
      body: `You have ${numIncompleteTasks} task${numIncompleteTasks !== 1 ? 's' : ''} to complete`,
      badge: numIncompleteTasks
    }));

    await expo.sendPushNotificationsAsync(messages);
  }
}