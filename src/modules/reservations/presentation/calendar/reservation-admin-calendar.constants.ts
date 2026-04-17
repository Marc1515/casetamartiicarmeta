export const ADMIN_RESERVATION_CALENDAR_PALETTE: Array<{
    bg: string;
    text: string;
}> = [
        { bg: "#023e8a", text: "#ffffff" },
        { bg: "#0077b6", text: "#ffffff" },
        { bg: "#0096c7", text: "#ffffff" },
        { bg: "#00b4d8", text: "#ffffff" },
        { bg: "#48cae4", text: "#ffffff" },
        { bg: "#90e0ef", text: "#ffffff" },
    ];

export const ADMIN_RESERVATION_CALENDAR_MESSAGES = {
    month: "Mes",
    week: "Semana",
    day: "Día",
    today: "Hoy",
    previous: "Atrás",
    next: "Siguiente",
    showMore: (total: number) => `+ Ver ${total} más`,
};