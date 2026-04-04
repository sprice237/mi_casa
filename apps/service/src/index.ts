import Expo from "expo-server-sdk";
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { db } from "./db.js";
import { generateTasksForRecurringTasks } from "./recurringTasks.js";
import { generateNotifications } from "./notifications.js";
import { config } from "./config.js";

const connection = new IORedis.default(config.REDIS_URL, { maxRetriesPerRequest: null });

const expo = new Expo();

await db.$connect();

const queue = new Queue('jobs', { connection });

await queue.upsertJobScheduler('recurring-tasks',
  { pattern: '0 0 2 * * *', tz: 'America/New_York' },
  {
    name: 'recurring-tasks',
  });

await queue.upsertJobScheduler('morning-notification',
  { pattern: '0 0 10 * * *', tz: 'America/New_York' },
  {
    name: 'morning-notification',
  });

const worker = new Worker('jobs', async job => {
  switch (job.name) {
    case 'recurring-tasks':
      await generateTasksForRecurringTasks({ db });
      break;
    case 'morning-notification':
      await generateNotifications({ db, expo })
      break;
    default:
      console.warn(`Unknown job name: ${job.name}`);
  }
}, { connection });

console.log(`worker started with id ${worker.id}`);
