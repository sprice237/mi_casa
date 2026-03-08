import { z } from "zod";

export const MessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('RECURRING_TASKS'),
  }),
  z.object({
    type: z.literal('MORNING_NOTIFICATION')
  })
]);