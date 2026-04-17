"use client";

import { useEffect, useState } from "react";
import { addMinutes, isAfter } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import ReservationFormFields from "@/modules/reservations/presentation/ui/ReservationFormFields";
import { buildEditReservationDefaultValues } from "@/modules/reservations/presentation/ui/reservation-form.defaults";
import {
  reservationFormSchema,
  type ReservationFormValues,
} from "@/modules/reservations/presentation/ui/reservation-form.schema";
import { useReservationDialogMobile } from "@/modules/reservations/presentation/ui/useReservationDialogMobile";

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

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: buildEditReservationDefaultValues(),
    mode: "onBlur",
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = form;

  const { isMobile, preventDialogAutoFocus, blurInputOnMobile } =
    useReservationDialogMobile({ open });

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

    return () => {
      window.removeEventListener("admin:event:edit", onEdit);
    };
  }, [reset]);

  async function onSubmit(data: ReservationFormValues) {
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
        onOpenAutoFocus={preventDialogAutoFocus}
      >
        <DialogHeader>
          <DialogTitle>Editar reserva</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ReservationFormFields
            form={form}
            isMobile={isMobile}
            onDateInputFocus={blurInputOnMobile}
          />

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
