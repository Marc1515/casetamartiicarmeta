"use client";

import { useEffect } from "react";
import { addMinutes, isAfter } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useReservationAdminCoordinator } from "@/modules/reservations/presentation/state/ReservationAdminCoordinator";

export default function EditReservaModal() {
  const {
    editingReservation,
    closeEdit,
    highlightReservation,
    notifyReservationsChanged,
  } = useReservationAdminCoordinator();

  const open = editingReservation !== null;

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
    if (!editingReservation) {
      reset(buildEditReservationDefaultValues());
      return;
    }

    const safeStart =
      editingReservation.start < new Date()
        ? new Date()
        : editingReservation.start;

    const safeEnd = isAfter(editingReservation.end, safeStart)
      ? editingReservation.end
      : addMinutes(safeStart, 30);

    reset({
      title: editingReservation.title,
      start: safeStart,
      end: safeEnd,
      notes: editingReservation.notes ?? "",
    });
  }, [editingReservation, reset]);

  async function onSubmit(data: ReservationFormValues): Promise<void> {
    if (!editingReservation) {
      return;
    }

    const result = await updateReservation(editingReservation.id, {
      title: data.title,
      start: data.start.toISOString(),
      end: data.end.toISOString(),
      allDay: false,
      notes: data.notes || null,
    });

    if (!result.ok) {
      if (result.status === 409) {
        if (result.error.overlapping?.id) {
          highlightReservation(result.error.overlapping.id);
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

    await notifyReservationsChanged({
      highlightId: result.data.id,
    });

    closeEdit();
  }

  async function handleDelete(): Promise<void> {
    if (!editingReservation) {
      return;
    }

    if (!confirm("¿Seguro que quieres eliminar esta reserva?")) {
      return;
    }

    const result = await deleteReservation(editingReservation.id);

    if (!result.ok) {
      alert(result.error.error ?? "Error al eliminar.");
      return;
    }

    await notifyReservationsChanged();
    closeEdit();
  }

  function handleOpenChange(nextOpen: boolean): void {
    if (!nextOpen) {
      closeEdit();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              disabled={!editingReservation || isSubmitting}
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
