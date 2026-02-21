import { SQSEvent } from "aws-lambda";
import { MessageSchema } from "./message.js";
import { db } from "./db.js";
import { generateTasksForRecurringTasks } from "./recurringTasks.js";

export const handler = async function handler(
  event: SQSEvent
) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  console.log(`event contains ${event.Records.length} record(s).`);

  for (const record of event.Records) {
    const messageParseResult = await MessageSchema.safeParseAsync(JSON.parse(record.body));

    if (messageParseResult.error) {
      console.error('Failed to parse message:', messageParseResult.error);
      continue;
    }

    const message = messageParseResult.data;

    switch (message.type) {
      case 'RECURRING_TASKS':
        console.log('Handling RECURRING_TASKS message');
        await generateTasksForRecurringTasks({ db });
        break;
    }
  }
}