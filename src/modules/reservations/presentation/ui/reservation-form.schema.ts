import { isAfter } from "date-fns";
import { z } from "zod";

export const reservationFormSchema = z
    .object({
        title: z.string().trim().min(1, "El título es obligatorio"),
        start: z.date(),
        end: z.date(),
        notes: z.string().trim(),
    })
    .superRefine((value, context) => {
        if (!isAfter(value.end, value.start)) {
            context.addIssue({
                code: "custom",
                message: "Fin debe ser posterior a inicio",
                path: ["end"],
            });
        }

        if (value.start < new Date()) {
            context.addIssue({
                code: "custom",
                message: "No se permiten fechas pasadas",
                path: ["start"],
            });
        }
    });

export type ReservationFormValues = z.infer<typeof reservationFormSchema>;