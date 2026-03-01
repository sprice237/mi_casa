import { z } from "zod";

export const RecurringTaskRuleSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('day'),
    interval: z.number().int().positive()
  }),
  z.object({
    type: z.literal('week'),
    interval: z.number().int().positive(),
    dow: z.array(z.number().int().positive()).refine(arr => arr.every(x => x >= 1 && x <= 7), 'Each day of week must be between 1 and 7'),
  }),
  z.object({
    type: z.literal('month_dom'),
    interval: z.number().int().positive(),
    dom: z.number().int().positive(),
  }),
  z.object({
    type: z.literal('month_dow'),
    interval: z.number().int().positive(),
    dow: z.number().int().positive().refine(x => x >= 1 && x <= 7, 'Each day of week must be between 1 and 7'),
    wom: z.number().int().positive(),
  }),
  z.object({
    type: z.literal('year'),
    interval: z.number().int().positive(),
    month: z.number().int().positive(),
    dom: z.number().int().positive(),
  }),
]);

export type RecurringTaskRule = z.infer<typeof RecurringTaskRuleSchema>;

export const AppJwtSchema = z.object({
  jti: z.string(),
  sub: z.string(),
  casaId: z.string()
});

export type AppJwt = z.infer<typeof AppJwtSchema>;