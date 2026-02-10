import { getDaysInMonth, startOfMonth } from "date-fns";

export const buildCalendarWeeks = ({ date, weekStartsOn }: { date: Date, weekStartsOn: number }) => {
  const firstOfMonth = startOfMonth(date);
  const daysInMonth = getDaysInMonth(firstOfMonth);

  const weeks: (number | null)[][] = [
    new Array((firstOfMonth.getDay() - weekStartsOn + 7) % 7).fill(null)
  ];

  for (let dom = 1; dom <= daysInMonth; ++dom) {
    const d = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth(), dom);
    const dayOfWeek = d.getDay();

    if (weeks[weeks.length - 1].length === 7) {
      weeks.push([]);
    }

    weeks[weeks.length - 1].push(dom);
  }

  for (let i = weeks[weeks.length - 1].length; i < 7; ++i) {
    weeks[weeks.length - 1].push(null);
  }

  return weeks;
}