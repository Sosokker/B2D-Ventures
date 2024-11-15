import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { TimeValue } from "@react-types/datepicker";

export function isEventOverlapping(
  eventDate: CalendarDate,
  startTime: TimeValue,
  endTime: TimeValue,
  existingEvents: { meet_date: string; start_time: string; end_time: string }[]
): boolean {
  const timezone = getLocalTimeZone();

  const newStartDate = eventDate.toDate(timezone);
  newStartDate.setHours(startTime.hour, startTime.minute);

  const newEndDate = eventDate.toDate(timezone);
  newEndDate.setHours(endTime.hour, endTime.minute);

  for (const log of existingEvents) {
    const [year, month, day] = log.meet_date.split("-").map(Number);
    const existingStartDate = new Date(year, month - 1, day);
    existingStartDate.setHours(parseInt(log.start_time.split(":")[0]), parseInt(log.start_time.split(":")[1]));

    const existingEndDate = new Date(year, month - 1, day);
    existingEndDate.setHours(parseInt(log.end_time.split(":")[0]), parseInt(log.end_time.split(":")[1]));

    const isOverlapping =
      (newStartDate < existingEndDate && newEndDate > existingStartDate) ||
      (existingStartDate < newEndDate && existingEndDate > newStartDate);

    if (isOverlapping) {
      return true;
    }
  }

  return false;
}
