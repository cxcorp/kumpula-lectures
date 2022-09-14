import React, { useCallback, useMemo, useRef, useState } from "react";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { autoUpdate, flip, offset, shift } from "@floating-ui/react-dom";
import {
  useFloating,
  useInteractions,
  useDismiss,
} from "@floating-ui/react-dom-interactions";
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

interface WeekCalendarProps {
  events?: ApiEvent[];
}

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
const calendarTooltipAccessor = (e: {
  start: Date;
  end: Date;
  title: JSX.Element; //e.lectureName,
  tooltip: string;
}) => e.tooltip;

function usePopup() {
  const arrowRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLElement>();

  const { x, y, reference, floating, strategy, placement, context } =
    useFloating({
      open,
      onOpenChange: setOpen,
      placement: "right",
      whileElementsMounted: autoUpdate,
      middleware: [offset(3), flip(), shift({ padding: 5 })],
    });

  const { getFloatingProps } = useInteractions([
    useDismiss(context, {
      referencePointerDown: true,
    }),
  ]);

  // get the CSS side which we need to offset
  // split by - to deal with "bottom-right" -> "bottom"
  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[placement.split("-")[0]];

  const openPopup = useCallback(
    (element: HTMLElement) => {
      reference(element);
      setReferenceElement(element);
      setOpen(true);
    },
    [reference, setReferenceElement, setOpen]
  );

  const getPopoverProps = useCallback(
    () => ({
      ref: floating,
      style: {
        position: strategy,
        top: `${y ?? 0}px`,
        left: `${x ?? 0}px`,
      },
      ...getFloatingProps(),
    }),
    [floating, strategy, getFloatingProps]
  );

  return {
    open,
    openPopup,
    getPopoverProps,
  };
}

function WeekCalendar({ events = [] }: WeekCalendarProps) {
  const evts = useMemo(
    () =>
      events.map((e) => ({
        start: new Date(e.start),
        end: new Date(e.end),
        title: <LectureTitle event={e} />, //e.lectureName,
        tooltip: `${e.lectureName}, ${e.studyGroupType} (${e.location})`,
        originalEvent: e,
      })),
    [events]
  );

  const [selectedEvent, setSelectedEvent] = useState<
    typeof evts[0] | undefined
  >();
  const { open, openPopup, getPopoverProps } = usePopup();

  const handleSelectEvent = useCallback(
    (
      event: {
        start: Date;
        end: Date;
        title: JSX.Element;
        tooltip: string;
        originalEvent: ApiEvent;
      },
      e: React.SyntheticEvent<HTMLElement, Event>
    ) => {
      setSelectedEvent(event);
      openPopup(e.currentTarget);
    },
    [openPopup]
  );

  return (
    <div className={styles.calendar}>
      {open && selectedEvent && (
        <dialog open className={styles.popover} {...getPopoverProps()}>
          <div className={styles.popover__content}>
            <div className={styles.popover__title}>
              {selectedEvent.originalEvent.lectureName}
            </div>
            <div style={{ fontSize: "12px", padding: "0.5rem 1rem" }}>
              {formatInTimeZone(
                selectedEvent.start,
                "Europe/Helsinki",
                "dd.MM.yyyy"
              )}{" "}
              -{" "}
              {formatInTimeZone(
                selectedEvent.start,
                "Europe/Helsinki",
                "HH:mm"
              )}
              &ndash;
              {formatInTimeZone(selectedEvent.end, "Europe/Helsinki", "HH:mm")}
              <br />
              {selectedEvent.originalEvent.studyGroupType}
              <br />
              {selectedEvent.originalEvent.location}
              <br />
              <br />
              <a href="#" style={{ color: "#0479a4" }}>
                See course in Studies
              </a>
            </div>
          </div>
        </dialog>
      )}

      <Calendar
        components={calendarComponents}
        className={styles.week_calendar}
        tooltipAccessor={calendarTooltipAccessor}
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
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
}

export default WeekCalendar;
