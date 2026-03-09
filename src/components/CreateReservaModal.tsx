"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, addMinutes, isAfter } from "date-fns";
import { es as esLocale } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

registerLocale("es", esLocale);

const schema = z
  .object({
    title: z.string().trim().min(1, "El título es obligatorio"),
    start: z.date(),
    end: z.date(),
    notes: z.string().trim(),
  })
  .superRefine((v, ctx) => {
    if (!isAfter(v.end, v.start)) {
      ctx.addIssue({
        code: "custom",
        message: "Fin debe ser posterior a inicio",
        path: ["end"],
      });
    }
    if (v.start < new Date()) {
      ctx.addIssue({
        code: "custom",
        message: "No se permiten fechas pasadas",
        path: ["start"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateReservaModal({ open, onOpenChange }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const now = new Date();
  const defaultStart = addMinutes(now, 30 - (now.getMinutes() % 30 || 30));
  const defaultEnd = addDays(defaultStart, 1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "Reserva",
      start: defaultStart,
      end: defaultEnd,
      notes: "",
    },
    mode: "onBlur",
  });

  const start = watch("start");
  const end = watch("end");

  const [endAuto, setEndAuto] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  async function onSubmit(data: FormValues) {
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        start: data.start.toISOString(),
        end: data.end.toISOString(),
        allDay: false,
        notes: data.notes || null,
      }),
    });

    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as {
        error?: string;
        overlapping?: { id?: string };
      };
      if (res.status === 409) {
        if (j.overlapping?.id) {
          window.dispatchEvent(
            new CustomEvent("admin:event:highlight", {
              detail: { id: j.overlapping.id! },
            }),
          );
        }
        setError("end", {
          type: "overlap",
          message: j.error ?? "Las fechas solapan con otra reserva.",
        });
      } else {
        alert(j?.error ?? "No se pudo guardar.");
      }
      return;
    }

    window.dispatchEvent(new Event("admin:events:changed"));

    const ns = addMinutes(new Date(), 30);
    reset({ title: "Reserva", start: ns, end: addDays(ns, 1), notes: "" });
    setEndAuto(true);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>Nueva reserva</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              className="w-full border rounded p-2"
              {...register("title")}
              placeholder="Reserva"
            />
            {errors.title && (
              <p className="text-red-600 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Inicio</label>
              <DatePicker
                selected={start}
                onChange={(d) => {
                  if (!d) return;
                  setValue("start", d, { shouldValidate: true });
                  if (endAuto)
                    setValue("end", addDays(d, 1), { shouldValidate: true });
                }}
                showTimeSelect
                timeIntervals={30}
                dateFormat="Pp"
                locale="es"
                minDate={new Date()}
                className="w-full border rounded p-2"
                placeholderText="Selecciona fecha y hora"
                popperClassName="admin-datepicker-popper"
                popperPlacement={isMobile ? "top-start" : "bottom-start"}
                showPopperArrow={!isMobile}
                popperProps={{ strategy: "fixed" }}
              />
              {errors.start && (
                <p className="text-red-600 text-sm">{errors.start.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fin</label>
              <DatePicker
                selected={end}
                onChange={(d) => {
                  if (!d) return;
                  setEndAuto(false);
                  setValue("end", d, { shouldValidate: true });
                }}
                onFocus={() => setEndAuto(false)}
                onCalendarOpen={() => setEndAuto(false)}
                showTimeSelect
                timeIntervals={30}
                dateFormat="Pp"
                locale="es"
                minDate={start ?? new Date()}
                className="w-full border rounded p-2"
                placeholderText="Selecciona fecha y hora"
                popperClassName="admin-datepicker-popper"
                popperPlacement={isMobile ? "top-start" : "bottom-start"}
                showPopperArrow={!isMobile}
                popperProps={{ strategy: "fixed" }}
              />
              {errors.end && (
                <p className="text-red-600 text-sm">{errors.end.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Notas (solo admin)
            </label>
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              {...register("notes")}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Crear reserva"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </DialogFooter>

          {endAuto && (
            <p className="text-xs text-gray-500">
              Mientras no edites “Fin”, se ajustará automáticamente a{" "}
              <b>+1 día</b> cuando cambies “Inicio”.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
