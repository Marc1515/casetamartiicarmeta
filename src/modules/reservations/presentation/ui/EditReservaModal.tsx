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
import {
  onAdminReservationEdit,
  emitAdminReservationHighlight,
  emitAdminReservationsChanged,
} from "@/modules/reservations/presentation/events/reservation-admin.events";

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
    const unsubscribe = onAdminReservationEdit((detail) => {
      const safeStart = detail.start < new Date() ? new Date() : detail.start;

      const safeEnd = isAfter(detail.end, safeStart)
        ? detail.end
        : addMinutes(safeStart, 30);

      setEditingId(detail.id);

      reset({
        title: detail.title,
        start: safeStart,
        end: safeEnd,
        notes: detail.notes ?? "",
      });

      setOpen(true);
    });

    return unsubscribe;
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
          emitAdminReservationHighlight({
            id: result.error.overlapping.id,
          });
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

    emitAdminReservationsChanged();
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

    emitAdminReservationsChanged();
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
