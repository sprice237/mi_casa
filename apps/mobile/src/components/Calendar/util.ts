import { utc, UTCDate } from "@date-fns/utc";
import { getDaysInMonth, startOfMonth } from "date-fns";

export const buildCalendarWeeks = ({ date, weekStartsOn }: { date: UTCDate, weekStartsOn: number }) => {
  const firstOfMonth = startOfMonth(date, { in: utc });
  const daysInMonth = getDaysInMonth(firstOfMonth);

  const weeks: (UTCDate | null)[][] = [
    new Array((firstOfMonth.getDay() - weekStartsOn + 7) % 7).fill(null)
  ];

  for (let dom = 1; dom <= daysInMonth; ++dom) {
    if (weeks[weeks.length - 1].length === 7) {
      weeks.push([]);
    }

    const d = utc(Date.UTC(firstOfMonth.getFullYear(), firstOfMonth.getMonth(), dom));
    weeks[weeks.length - 1].push(d);
  }

  for (let i = weeks[weeks.length - 1].length; i < 7; ++i) {
    weeks[weeks.length - 1].push(null);
  }

  return weeks;
}