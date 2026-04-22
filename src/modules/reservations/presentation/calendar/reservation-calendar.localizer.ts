import { format, getDay, parse, startOfWeek } from "date-fns";
import { ca, de, enUS, es, fr } from "date-fns/locale";
import { dateFnsLocalizer } from "react-big-calendar";

export const reservationCalendarLocalizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
    getDay: (date: Date) => getDay(date),
    locales: {
        ca,
        es,
        en: enUS,
        fr,
        de,
    },
});