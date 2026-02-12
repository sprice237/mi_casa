import { Prisma, PrismaClient, RecurringTask as DbRecurringTask } from '@mi_casa/db/client';
import { shimRecurringTask, shimRecurringTaskProjection } from './shims.js';
import { CreateRecurringTaskInput, UpdateRecurringTaskInput } from './types.js';


export class RecurringTasksService {

  constructor(private db: PrismaClient) { }

  async findMany(args?: Pick<NonNullable<Parameters<typeof this.db.recurringTask.findMany>[0]>, 'where' | 'orderBy' | 'skip' | 'take'>) {
    const dbRecurringTasks = await this.db.recurringTask.findMany(args);
    const recurringTasks = dbRecurringTasks.map(shimRecurringTask);
    return recurringTasks
  }

  async findUniqueOrThrow(args: Pick<NonNullable<Parameters<typeof this.db.recurringTask.findUniqueOrThrow>[0]>, 'where'>) {
    const dbRecurringTask = await this.db.recurringTask.findUniqueOrThrow(args);
    const recurringTask = shimRecurringTask(dbRecurringTask);
    return recurringTask
  }

  async create({ data }: { data: CreateRecurringTaskInput }) {
    const dbRecurringTask = await this.db.recurringTask.create({ data });
    const recurringTask = shimRecurringTask(dbRecurringTask);
    return recurringTask
  }

  async update({ where, data }: Pick<Parameters<typeof this.db.recurringTask.update>[0], 'where'> & { data: UpdateRecurringTaskInput }) {
    const dbRecurringTask = await this.db.recurringTask.update({
      where, data: {
        name: data.name ?? Prisma.skip,
        rule: data.rule ?? Prisma.skip,
        startDate: data.startDate ?? Prisma.skip,
      }
    });
    const recurringTask = shimRecurringTask(dbRecurringTask);
    return recurringTask
  }

  async delete({ where }: Pick<Parameters<typeof this.db.recurringTask.delete>[0], 'where'>) {
    const dbRecurringTask = await this.db.recurringTask.delete({
      where
    });
    const recurringTask = shimRecurringTask(dbRecurringTask);
    return recurringTask
  }

  async getProjections({ where, startDate, endDate }: { where?: { id?: string | { in: readonly string[] } }, startDate: Date; endDate: Date }) {
    // this approach iterates numerically through each instance of a recurring task
    // at each instance, the date of that instance is calculated using the rule 
    // execution ends when the calculated date exceeds the end date

    // an alternative approach is to iterate through date in the date range and calculate
    // if that date matches the rule for each recurring task, but that would likely be less efficient
    // as it would require more calculations overall, especially for long date ranges with many recurring tasks
    // the preliminary workings for a query that would work for that approach is in a comment
    // located below the return statement of this function

    // GAWD DAMN removing all of the common table expressions in this query sped it up.
    // needs to be cleaned up and better organized.

    const projections = await this.db.$queryRaw<(DbRecurringTask & { n: number, date: Date })[]>`
select "RecurringTask".*, p.n, p.date
from "RecurringTask"
         join lateral (
    with recursive generated_dates(n, "date") as (
        select 0 n, null::date d

        union all

        (
            with n as (
                select generated_dates.n + 1 n
                from generated_dates
            ),
                 d as (
                     select (
                                case "rule" ->> 'type'
                                    when 'day' then (
                                            "RecurringTask"."startDate" +
                                            (n - 1) * ("RecurringTask".rule ->> 'interval')::integer
                                        )
                                    when 'week' then (
                                            "RecurringTask"."startDate" +
                                            (n - 1) / jsonb_array_length("RecurringTask".rule -> 'dow') * 7 *
                                            ("RecurringTask".rule ->> 'interval')::integer +
                                            (array(
                                                    select unnest(array_agg(
                                                                (dow::text::integer - extract(isodow from "RecurringTask"."startDate") +
                                                                 7) % 7
                                                        )) u
                                                    from jsonb_array_elements("RecurringTask".rule -> 'dow') t(dow)
                                                    order by u
                                                )::integer[])[(n - 1) % jsonb_array_length("RecurringTask".rule -> 'dow') + 1]
                                        )
                                    when 'month_dom' then (
                                        (
                                                make_date(extract(year from "RecurringTask"."startDate")::integer,
                                                          extract(month from "RecurringTask"."startDate")::integer,
                                                          ("RecurringTask".rule -> 'dom')::integer) +
                                                (case (make_date(
                                                               extract(year from "RecurringTask"."startDate")::integer,
                                                               extract(month from "RecurringTask"."startDate")::integer,
                                                               ("RecurringTask".rule -> 'dom')::integer) >=
                                                       "RecurringTask"."startDate")
                                                     when true then 0
                                                     else 1 end) * '1 month'::interval +
                                                (n - 1) * ("RecurringTask".rule ->> 'interval')::integer * '1 month'::interval
                                            )::date
                                        )
                                    when 'month_dow' then (
                                        ((((date_trunc('month', "RecurringTask"."startDate")::date +
                                                         (case (((date_trunc('month', "RecurringTask"."startDate")::date +
                                                         ((("RecurringTask".rule ->> 'dow')::integer -
                                                           extract(isodow from date_trunc('month', "RecurringTask"."startDate")::date) + 7) %
                                                          7)::integer) +
                                                         (("RecurringTask".rule ->> 'wom')::integer - 1) * '1 week'::interval)::date >= "RecurringTask"."startDate")
                                                              when true then 0
                                                              else 1 end) *
                                                         '1 month'::interval)::date + (n - 1) * ("RecurringTask".rule ->> 'interval')::integer *
                                                        '1 month'::interval)::date +
                                                         ((("RecurringTask".rule ->> 'dow')::integer -
                                                           extract(isodow from ((date_trunc('month', "RecurringTask"."startDate")::date +
                                                         (case (((date_trunc('month', "RecurringTask"."startDate")::date +
                                                         ((("RecurringTask".rule ->> 'dow')::integer -
                                                           extract(isodow from date_trunc('month', "RecurringTask"."startDate")::date) + 7) %
                                                          7)::integer) +
                                                         (("RecurringTask".rule ->> 'wom')::integer - 1) * '1 week'::interval)::date >= "RecurringTask"."startDate")
                                                              when true then 0
                                                              else 1 end) *
                                                         '1 month'::interval)::date + (n - 1) * ("RecurringTask".rule ->> 'interval')::integer *
                                                        '1 month'::interval)::date) + 7) %
                                                          7)::integer) +
                                                         (("RecurringTask".rule ->> 'wom')::integer - 1) * '1 week'::interval)::date
                                    )
                                    when 'year' then (
                                         (
                                                       make_date(extract(year from "RecurringTask"."startDate")::integer,
                                                             ("RecurringTask".rule -> 'month')::integer,
                                                             ("RecurringTask".rule -> 'dom')::integer) +
                                                       (case (make_date(extract(year from "RecurringTask"."startDate")::integer,
                                                             ("RecurringTask".rule -> 'month')::integer,
                                                             ("RecurringTask".rule -> 'dom')::integer) >= "RecurringTask"."startDate") when true then 0 else 1 end) *
                                                       '1 year'::interval +
                                                       (n - 1) * ("RecurringTask".rule ->> 'interval')::integer *
                                                        '1 year'::interval
                                                   )::date

                                    )
                                    end
                                ) d
                     from n
                 )
            select n, d
            from n,
                 d
            where d < ${endDate.toISOString().split('T')[0]}::date
        )
    )
    select *
    from generated_dates
    where n != 0
      and "date" >= ${startDate.toISOString().split('T')[0]}::date
    ) p on true;
    `;

    const shimmedProjections = projections.map(shimRecurringTaskProjection);

    return shimmedProjections;

    /*

    with dates as (
        select d::date from generate_series('2026-01-01'::date, '2027-01-01'::date, '1 day'::interval) as g(d)
    ), start_date as (
        select '2026-01-05'::date as d
    )
    select
        dates.d,
        dates.d >= start_date.d and (case "rule"->>'type'
            when 'day' then (
                (dates.d - start_date.d) % ("RecurringTask".rule->>'interval')::integer = 0
            )
            when 'week' then (
                ((dates.d - start_date.d) / 7 % ("RecurringTask".rule->>'interval')::integer = 0) and
                ("RecurringTask".rule->'dow' @> (extract(isodow from dates.d) % 7)::text::jsonb)
            )
            when 'month_dom' then (
                ((extract(year from age(dates.d, start_date.d)) * 12 + extract(month from age(dates.d, start_date.d))) % ("RecurringTask".rule->>'interval')::integer = 0) and
                (extract(day from dates.d) = ("RecurringTask".rule->>'dom')::integer)
            )
            when 'month_dow' then (
                ((extract(year from age(dates.d, start_date.d)) * 12 + extract(month from age(dates.d, start_date.d))) % ("RecurringTask".rule->>'interval')::integer = 0) and
                ((extract(day from age(dates.d, date_trunc('month', dates.d)))::integer / 7 + 1) = ("RecurringTask".rule->>'wom')::integer) and
                (("RecurringTask".rule->>'dow')::integer = (extract(isodow from dates.d) % 7))
            )
            when 'year' then (
                (extract(year from age(dates.d, start_date.d)) % ("RecurringTask".rule->>'interval')::integer = 0) and
                (extract(month from dates.d) = ("RecurringTask".rule->>'month')::integer) and
                (extract(day from dates.d) = ("RecurringTask".rule->>'dom')::integer)
            )
            end
        ) q,
        extract(month from dates.d),
        "RecurringTask".id,
        "RecurringTask".name,
        "RecurringTask".rule
    from "RecurringTask", start_date, dates

    */

  }
}