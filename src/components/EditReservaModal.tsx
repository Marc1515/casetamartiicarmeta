"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMinutes, isAfter } from "date-fns";
import { es as esLocale } from "date-fns/locale";
registerLocale("es", esLocale);

// Schema (mismo shape que el de crear)
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
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setError,
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

  // Abre el modal al clicar un evento del calendario
  useEffect(() => {
    const handler = (ev: Event) => {
      const e = ev as CustomEvent<EditEventDetail>;
      const s = e.detail.start < new Date() ? new Date() : e.detail.start;
      const en = isAfter(e.detail.end, s) ? e.detail.end : addMinutes(s, 30);

      setEditingId(e.detail.id);
      reset({
        title: e.detail.title,
        start: s,
        end: en,
        notes: e.detail.notes ?? "",
      });

      dialogRef.current?.showModal();
    };

    window.addEventListener("admin:event:edit", handler);
    return () => window.removeEventListener("admin:event:edit", handler);
  }, [reset]);

  function close() {
    dialogRef.current?.close();
    setEditingId(null);
  }

  // Cerrar al clicar fuera (backdrop)
  function onDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) close();
  }

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
      const j = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setError("end", {
          type: "overlap",
          message: j?.error ?? "Hay solape con otra reserva.",
        });
      } else {
        alert((j as { error?: string }).error ?? "No se pudo guardar.");
      }
      return;
    }
    window.dispatchEvent(new Event("admin:events:changed"));
    close();
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
    close();
  }

  return (
    <dialog
      ref={dialogRef}
      className="rounded-2xl p-0 border w-[min(92vw,680px)]"
      onClick={onDialogClick}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Editar reserva</h3>
          <button
            onClick={close}
            className="text-sm opacity-70 hover:opacity-100"
          >
            Cerrar ✕
          </button>
        </div>

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

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded border px-4 py-2 text-red-600 border-red-300"
              disabled={isSubmitting}
            >
              Eliminar
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
