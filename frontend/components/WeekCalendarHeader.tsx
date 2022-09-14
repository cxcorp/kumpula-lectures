import type { HeaderProps } from "react-big-calendar";
import { format } from "date-fns-tz";
import { dateLocale } from "../common";
import s from "../styles/WeekCalendarHeader.module.scss";
import { useLocalizationContext } from "./LocalizationContext";
import { weekdays } from "../translations";

function WeekCalendarHeader({ date, label, localizer }: HeaderProps) {
  const { lang } = useLocalizationContext();

  return (
    <div className={s.header}>
      <span className={s.day_name}>{weekdays[lang][date.getDay()]}</span>
      <span className={s.day_number}>
        {format(date, "d", {
          locale: dateLocale,
          timeZone: "Europe/Helsinki",
        })}
      </span>
    </div>
  );
}

export default WeekCalendarHeader;
