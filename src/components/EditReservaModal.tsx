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

  // Abrir al clicar un evento del calendario
  useEffect(() => {
    const onEdit = (e: Event) => {
      const ev = e as CustomEvent<EditEventDetail>;
      const s = ev.detail.start < new Date() ? new Date() : ev.detail.start;
      const en = isAfter(ev.detail.end, s) ? ev.detail.end : addMinutes(s, 30);

      setEditingId(ev.detail.id);
      reset({
        title: ev.detail.title,
        start: s,
        end: en,
        notes: ev.detail.notes ?? "",
      });
      setOpen(true);
    };
    window.addEventListener("admin:event:edit", onEdit);
    return () => window.removeEventListener("admin:event:edit", onEdit);
  }, [reset]);

  async function onSubmit(data: FormValues) {
    if (!editingId) return;
    const res = await fetch(`/api/admin/events/${editingId}`, {
      method: "PUT",
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
            })
          );
        }
        setError("end", {
          type: "overlap",
          message: j.error ?? "Hay solape con otra reserva.",
        });
      } else {
        alert(j?.error ?? "No se pudo guardar.");
      }
      return;
    }

    window.dispatchEvent(new Event("admin:events:changed"));
    setOpen(false);
    setEditingId(null);
  }

  async function handleDelete() {
    if (!editingId) return;
    if (!confirm("¿Seguro que quieres eliminar esta reserva?")) return;
    const res = await fetch(`/api/admin/events/${editingId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      alert("Error al eliminar.");
      return;
    }
    window.dispatchEvent(new Event("admin:events:changed"));
    setOpen(false);
    setEditingId(null);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>Editar reserva</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              className="w-full border rounded p-2"
              {...register("title")}
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
                onChange={(d) =>
                  d && setValue("start", d, { shouldValidate: true })
                }
                showTimeSelect
                timeIntervals={30}
                dateFormat="Pp"
                locale="es"
                minDate={new Date()}
                className="w-full border rounded p-2"
              />
              {errors.start && (
                <p className="text-red-600 text-sm">{errors.start.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fin</label>
              <DatePicker
                selected={end}
                onChange={(d) =>
                  d && setValue("end", d, { shouldValidate: true })
                }
                showTimeSelect
                timeIntervals={30}
                dateFormat="Pp"
                locale="es"
                minDate={start ?? new Date()}
                className="w-full border rounded p-2"
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
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
