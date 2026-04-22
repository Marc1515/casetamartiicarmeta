"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getAdminReservations } from "@/modules/reservations/presentation/api/reservations.client";
import { toAdminReservationCalendarEventList } from "@/modules/reservations/presentation/mappers/reservation-calendar.mapper";
import type { AdminReservationCalendarEvent } from "@/modules/reservations/presentation/models/reservation-calendar.model";

type NotifyReservationsChangedOptions = {
  highlightId?: string | null;
};

type ReservationAdminCoordinatorContextValue = {
  events: AdminReservationCalendarEvent[];
  highlightedId: string | null;
  createOpen: boolean;
  editingReservation: AdminReservationCalendarEvent | null;
  openCreate: () => void;
  closeCreate: () => void;
  openEdit: (reservation: AdminReservationCalendarEvent) => void;
  closeEdit: () => void;
  highlightReservation: (id: string) => void;
  reload: () => Promise<void>;
  notifyReservationsChanged: (
    options?: NotifyReservationsChangedOptions,
  ) => Promise<void>;
};

const ReservationAdminCoordinatorContext =
  createContext<ReservationAdminCoordinatorContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export function ReservationAdminCoordinatorProvider({ children }: Props) {
  const [events, setEvents] = useState<AdminReservationCalendarEvent[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<AdminReservationCalendarEvent | null>(null);

  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const clearHighlightTimeout = useCallback((): void => {
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = null;
    }
  }, []);

  const reload = useCallback(async (): Promise<void> => {
    const result = await getAdminReservations();

    if (!result.ok) {
      return;
    }

    setEvents(toAdminReservationCalendarEventList(result.data));
  }, []);

  useEffect(() => {
    void reload();

    return () => {
      clearHighlightTimeout();
    };
  }, [clearHighlightTimeout, reload]);

  const highlightReservation = useCallback(
    (id: string): void => {
      clearHighlightTimeout();
      setHighlightedId(id);

      highlightTimeoutRef.current = setTimeout(() => {
        setHighlightedId((currentId) => (currentId === id ? null : currentId));
        highlightTimeoutRef.current = null;
      }, 4000);
    },
    [clearHighlightTimeout],
  );

  const openCreate = useCallback((): void => {
    setCreateOpen(true);
  }, []);

  const closeCreate = useCallback((): void => {
    setCreateOpen(false);
  }, []);

  const openEdit = useCallback((reservation: AdminReservationCalendarEvent) => {
    setEditingReservation(reservation);
  }, []);

  const closeEdit = useCallback((): void => {
    setEditingReservation(null);
  }, []);

  const notifyReservationsChanged = useCallback(
    async (options?: NotifyReservationsChangedOptions): Promise<void> => {
      await reload();

      if (options?.highlightId) {
        highlightReservation(options.highlightId);
      }
    },
    [highlightReservation, reload],
  );

  const value = useMemo<ReservationAdminCoordinatorContextValue>(
    () => ({
      events,
      highlightedId,
      createOpen,
      editingReservation,
      openCreate,
      closeCreate,
      openEdit,
      closeEdit,
      highlightReservation,
      reload,
      notifyReservationsChanged,
    }),
    [
      events,
      highlightedId,
      createOpen,
      editingReservation,
      openCreate,
      closeCreate,
      openEdit,
      closeEdit,
      highlightReservation,
      reload,
      notifyReservationsChanged,
    ],
  );

  return (
    <ReservationAdminCoordinatorContext.Provider value={value}>
      {children}
    </ReservationAdminCoordinatorContext.Provider>
  );
}

export function useReservationAdminCoordinator(): ReservationAdminCoordinatorContextValue {
  const context = useContext(ReservationAdminCoordinatorContext);

  if (!context) {
    throw new Error(
      "useReservationAdminCoordinator must be used within ReservationAdminCoordinatorProvider",
    );
  }

  return context;
}
