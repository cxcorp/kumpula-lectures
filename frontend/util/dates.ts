import { parse } from "date-fns";

function* iterateWeekDaysForWeek(weekNumber: number) {
  const weekStartDate = parse(`${weekNumber}`, "I", new Date());

  // ISO weeks have exactly 7 days per week
  for (let i = 0; i < 7; i++) {
    yield new Date(weekStartDate.getTime());
    weekStartDate.setDate(weekStartDate.getDate() + 1);
  }
}
export function getWeekDaysForWeek(weekNumber: number) {
  return [...iterateWeekDaysForWeek(weekNumber)];
}
