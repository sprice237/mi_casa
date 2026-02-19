import { db } from "./db.js";
import { generateTasksForRecurringTasks } from "./recurringTasks.js";

await db.$connect();
await generateTasksForRecurringTasks({ db });
await db.$disconnect();
