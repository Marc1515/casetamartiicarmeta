import { z } from "zod";

const updateReservationBaseSchema = z.object({
    title: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "El título es obligatorio"
                    : "El título debe ser un texto",
        })
        .trim()
        .min(1, { error: "El título es obligatorio" })
        .max(120, { error: "El título no puede superar los 120 caracteres" }),

    start: z.coerce.date({
        error: (issue) =>
            issue.input === undefined
                ? "La fecha de inicio es obligatoria"
                : "La fecha de inicio no es válida",
    }),

    end: z.coerce.date({
        error: (issue) =>
            issue.input === undefined
                ? "La fecha de fin es obligatoria"
                : "La fecha de fin no es válida",
    }),

    allDay: z.boolean().optional().default(true),
});

export const updateReservationSchema = updateReservationBaseSchema.refine(
    (data) => data.end > data.start,
    {
        message: "La fecha de fin debe ser posterior a la de inicio",
        path: ["end"],
    },
);

export type UpdateReservationSchema = z.infer<
    typeof updateReservationSchema
>;