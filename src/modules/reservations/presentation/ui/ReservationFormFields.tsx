"use client";

import type { FocusEvent } from "react";
import { addDays } from "date-fns";
import DatePicker, { registerLocale } from "react-datepicker";
import { es as esLocale } from "date-fns/locale";
import type { UseFormReturn } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import type { ReservationFormValues } from "@/modules/reservations/presentation/ui/reservation-form.schema";

registerLocale("es", esLocale);

type Props = {
  form: UseFormReturn<ReservationFormValues>;
  isMobile: boolean;
  onDateInputFocus: (event: FocusEvent<HTMLElement>) => void;
  endAuto?: boolean;
  setEndAuto?: (value: boolean) => void;
  showEndAutoHint?: boolean;
  titlePlaceholder?: string;
};

export default function ReservationFormFields({
  form,
  isMobile,
  onDateInputFocus,
  endAuto,
  setEndAuto,
  showEndAutoHint = false,
  titlePlaceholder = "Reserva",
}: Props) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const start = watch("start");
  const end = watch("end");

  const shouldAutoAdjustEnd =
    typeof endAuto === "boolean" && typeof setEndAuto === "function";

  return (
    <>
      <div>
        <label className="mb-1 block text-sm font-medium">Título</label>
        <input
          className="w-full rounded border p-2"
          {...register("title")}
          placeholder={titlePlaceholder}
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
              if (!date) {
                return;
              }

              setValue("start", date, { shouldValidate: true });

              if (shouldAutoAdjustEnd && endAuto) {
                setValue("end", addDays(date, 1), { shouldValidate: true });
              }
            }}
            showTimeSelect
            timeIntervals={30}
            dateFormat="Pp"
            locale="es"
            minDate={new Date()}
            className="w-full rounded border p-2"
            placeholderText="Selecciona fecha y hora"
            onFocus={onDateInputFocus}
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
              if (!date) {
                return;
              }

              if (shouldAutoAdjustEnd && setEndAuto) {
                setEndAuto(false);
              }

              setValue("end", date, { shouldValidate: true });
            }}
            onFocus={(event) => {
              if (shouldAutoAdjustEnd && setEndAuto) {
                setEndAuto(false);
              }

              onDateInputFocus(event);
            }}
            onCalendarOpen={() => {
              if (shouldAutoAdjustEnd && setEndAuto) {
                setEndAuto(false);
              }
            }}
            showTimeSelect
            timeIntervals={30}
            dateFormat="Pp"
            locale="es"
            minDate={start ?? new Date()}
            className="w-full rounded border p-2"
            placeholderText="Selecciona fecha y hora"
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

      {showEndAutoHint && endAuto && (
        <p className="text-xs text-gray-500">
          Mientras no edites “Fin”, se ajustará automáticamente a <b>+1 día</b>{" "}
          cuando cambies “Inicio”.
        </p>
      )}
    </>
  );
}
