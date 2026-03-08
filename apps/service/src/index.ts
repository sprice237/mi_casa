import Expo from "expo-server-sdk";
import { db } from "./db.js";
import { generateTasksForRecurringTasks } from "./recurringTasks.js";
import { program } from 'commander';
import { generateNotifications } from "./notifications.js";

const expo = new Expo();

await db.$connect();

try {
  program.command('recurring-tasks').action(async () => {
    await generateTasksForRecurringTasks({ db });
  });

  program.command('morning-notification').action(async () => {
    await generateNotifications({ db, expo })
  });

  await program.parseAsync();
} finally {
  await db.$disconnect();
}
