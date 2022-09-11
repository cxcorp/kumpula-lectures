import React, { useState } from "react";
import { getISOWeek, format, parse, startOfWeek, getDay } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import cls from "classnames";

import type { Event as ApiEvent } from "../api";
import { dateLocale } from "../common";
import { getWeekDaysForWeek } from "../util/dates";
import styles from "../styles/WeekCalendar.module.scss";

const rbcLocalizer = dateFnsLocalizer({
  format,
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

function WeekCalendar({ events = [] }: WeekCalendarProps) {
  const evts = events.map((e) => ({
    start: new Date(e.start),
    end: new Date(e.end),
    title: <LectureTitle event={e} />, //e.lectureName,
    tooltip: `${e.lectureName}, ${e.studyGroupType} (${e.location})`,
  }));

  return (
    <div className={styles.calendar}>
      {/* <div> */}
      {/* <div className={styles.header}>
          {weekDays.map((day) => (
            <DayHeaderCell key={day.toISOString()} day={day} />
          ))}
        </div>
        <div className={styles.body}></div>
        <ul>
          {weekDays.map((day) => (
            <li key={day.toISOString()}>{day.toISOString()}</li>
          ))}
        </ul> */}
      {/* </div> */}
      <Calendar
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
      />
    </div>
  );
}

// interface WeekCalendarContainerProps {
//   events: ApiEvent[];
// }

// function WeekCalendarContainer({ events }: WeekCalendarContainerProps) {
//   return <WeekCalendar events={events} />;
// }

export default WeekCalendar;
