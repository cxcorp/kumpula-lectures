import React from "react";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import type { HeaderProps } from "react-big-calendar";
import cls from "classnames";

import type { Event as ApiEvent } from "../api";
import { dateLocale } from "../common";
import WeekCalendarHeader from "./WeekCalendarHeader";
import styles from "../styles/WeekCalendar.module.scss";

const rbcLocalizer = dateFnsLocalizer({
  format: (date: string | number | Date, format: string, opts: object) =>
    formatInTimeZone(date, "Europe/Helsinki", format, opts),
  parse,
  startOfWeek,
  getDay,
  locales: { "fi-FI": dateLocale },
});

interface DayHeaderCellProps {
  day: Date;
}

function DayHeaderCell({ day }: DayHeaderCellProps) {
  return (
    <div className={styles.day_header_cell}>
      <span className={styles.day_header_cell__day_name}>
        {format(day, "EEEEEE", { locale: dateLocale })}
      </span>
      <span className={styles.day_header_cell__day_number}>
        {day.getDate()}
      </span>
    </div>
  );
}

interface WeekCalendarProps {
  events?: ApiEvent[];
}

// function DayBodyColumn({});

function LectureTitle({ event }: { event: ApiEvent }) {
  const timeRange = [
    format(new Date(event.start), "HH:mm"),
    format(new Date(event.end), "HH:mm"),
  ].join(" - ");

  return (
    <div className={styles.event}>
      <div className={styles.event__name}>
        {event.lectureName}, {event.studyGroupType}
      </div>
      <div className={cls("rbc-event-label", styles.event__time)}>
        {timeRange}
      </div>
      <div>{event.location}</div>
    </div>
  );
}

const calendarMin = parse("07:00", "HH:mm", new Date());
const calendarMax = parse("20:00", "HH:mm", new Date());
const calendarComponents = {
  week: {
    header: WeekCalendarHeader,
  },
};

function WeekCalendar({ events = [] }: WeekCalendarProps) {
  const evts = events.map((e) => ({
    start: new Date(e.start),
    end: new Date(e.end),
    title: <LectureTitle event={e} />, //e.lectureName,
    tooltip: `${e.lectureName}, ${e.studyGroupType} (${e.location})`,
  }));

  return (
    <div className={styles.calendar}>
      <Calendar
        components={calendarComponents}
        className={styles.week_calendar}
        tooltipAccessor={(e) => e.tooltip}
        events={evts}
        localizer={rbcLocalizer}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        culture="fi-FI"
        step={60}
        timeslots={1}
        min={calendarMin}
        max={calendarMax}
      />
    </div>
  );
}

export default WeekCalendar;
