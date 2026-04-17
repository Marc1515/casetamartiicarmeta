"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMinutes, isAfter } from "date-fns";
import { es as esLocale } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/presentation/ui/dialog";
import { Button } from "@/shared/presentation/ui/button";
import {
  deleteReservation,
  updateReservation,
} from "@/modules/reservations/presentation/api/reservations.client";

registerLocale("es", esLocale);

const schema = z
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

type FormValues = z.infer<typeof schema>;

type EditEventDetail = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  notes?: string | null;
};

export default function EditReservaModal() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      start: new Date(),
      end: addMinutes(new Date(), 30),
      notes: "",
    },
    mode: "onBlur",
  });

  const start = watch("start");
  const end = watch("end");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !open) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement | null;

      if (activeElement && typeof activeElement.blur === "function") {
        activeElement.blur();
      }
    }, 50);

    return () => window.clearTimeout(timeoutId);
  }, [isMobile, open]);

  useEffect(() => {
    const onEdit = (event: Event) => {
      const customEvent = event as CustomEvent<EditEventDetail>;
      const safeStart =
        customEvent.detail.start < new Date()
          ? new Date()
          : customEvent.detail.start;
      const safeEnd = isAfter(customEvent.detail.end, safeStart)
        ? customEvent.detail.end
        : addMinutes(safeStart, 30);

      setEditingId(customEvent.detail.id);
      reset({
        title: customEvent.detail.title,
        start: safeStart,
        end: safeEnd,
        notes: customEvent.detail.notes ?? "",
      });
      setOpen(true);
    };

    window.addEventListener("admin:event:edit", onEdit);

    return () => window.removeEventListener("admin:event:edit", onEdit);
  }, [reset]);

  async function onSubmit(data: FormValues) {
    if (!editingId) {
      return;
    }

    const result = await updateReservation(editingId, {
      title: data.title,
      start: data.start.toISOString(),
      end: data.end.toISOString(),
      allDay: false,
      notes: data.notes || null,
    });

    if (!result.ok) {
      if (result.status === 409) {
        if (result.error.overlapping?.id) {
          window.dispatchEvent(
            new CustomEvent("admin:event:highlight", {
              detail: { id: result.error.overlapping.id },
            }),
          );
        }

        setError("end", {
          type: "overlap",
          message: result.error.error ?? "Hay solape con otra reserva.",
        });

        return;
      }

      alert(result.error.error ?? "No se pudo guardar.");
      return;
    }

    window.dispatchEvent(new Event("admin:events:changed"));
    setOpen(false);
    setEditingId(null);
  }

  async function handleDelete() {
    if (!editingId) {
      return;
    }

    if (!confirm("¿Seguro que quieres eliminar esta reserva?")) {
      return;
    }

    const result = await deleteReservation(editingId);

    if (!result.ok) {
      alert(result.error.error ?? "Error al eliminar.");
      return;
    }

    window.dispatchEvent(new Event("admin:events:changed"));
    setOpen(false);
    setEditingId(null);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[680px]"
        onOpenAutoFocus={(event) => {
          if (isMobile) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Editar reserva</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Título</label>
            <input
              className="w-full rounded border p-2"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Inicio</label>
              <DatePicker
                selected={start}
                onChange={(date) => {
                  if (date) {
                    setValue("start", date, { shouldValidate: true });
                  }
                }}
                showTimeSelect
                timeIntervals={30}
                dateFormat="Pp"
                locale="es"
                minDate={new Date()}
                className="w-full rounded border p-2"
                onFocus={(event) => {
                  if (isMobile) {
                    (event.target as HTMLInputElement).blur();
                  }
                }}
                popperClassName="admin-datepicker-popper"
                popperPlacement={isMobile ? "top-start" : "bottom-start"}
                showPopperArrow={!isMobile}
                popperProps={{ strategy: "fixed" }}
              />
              {errors.start && (
                <p className="text-sm text-red-600">{errors.start.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Fin</label>
              <DatePicker
                selected={end}
                onChange={(date) => {
                  if (date) {
                    setValue("end", date, { shouldValidate: true });
                  }
                }}
                showTimeSelect
                timeIntervals={30}
                dateFormat="Pp"
                locale="es"
                minDate={start ?? new Date()}
                className="w-full rounded border p-2"
                onFocus={(event) => {
                  if (isMobile) {
                    (event.target as HTMLInputElement).blur();
                  }
                }}
                popperClassName="admin-datepicker-popper"
                popperPlacement={isMobile ? "top-start" : "bottom-start"}
                showPopperArrow={!isMobile}
                popperProps={{ strategy: "fixed" }}
              />
              {errors.end && (
                <p className="text-sm text-red-600">{errors.end.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Notas (solo admin)
            </label>
            <textarea
              className="w-full rounded border p-2"
              rows={3}
              {...register("notes")}
            />
          </div>

          <DialogFooter className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={!editingId || isSubmitting}
            >
              Eliminar
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
