"use client";

import { useState } from "react";
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
import { createReservation } from "@/modules/reservations/presentation/api/reservations.client";
import ReservationFormFields from "@/modules/reservations/presentation/ui/ReservationFormFields";
import { buildCreateReservationDefaultValues } from "@/modules/reservations/presentation/ui/reservation-form.defaults";
import {
  reservationFormSchema,
  type ReservationFormValues,
} from "@/modules/reservations/presentation/ui/reservation-form.schema";
import { useReservationDialogMobile } from "@/modules/reservations/presentation/ui/useReservationDialogMobile";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateReservaModal({ open, onOpenChange }: Props) {
  const [endAuto, setEndAuto] = useState(true);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: buildCreateReservationDefaultValues(),
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

  async function onSubmit(data: ReservationFormValues) {
    const result = await createReservation({
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
          message: result.error.error ?? "Las fechas solapan con otra reserva.",
        });
      } else {
        alert(result.error.error ?? `Error ${result.status} al guardar.`);
      }

      return;
    }

    window.dispatchEvent(new Event("admin:events:changed"));
    reset(buildCreateReservationDefaultValues());
    setEndAuto(true);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[680px]"
        onOpenAutoFocus={preventDialogAutoFocus}
      >
        <DialogHeader>
          <DialogTitle>Nueva reserva</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ReservationFormFields
            form={form}
            isMobile={isMobile}
            onDateInputFocus={blurInputOnMobile}
            endAuto={endAuto}
            setEndAuto={setEndAuto}
            showEndAutoHint
          />

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Crear reserva"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
