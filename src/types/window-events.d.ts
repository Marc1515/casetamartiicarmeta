// src/types/window-events.d.ts
type AdminEventDetail = {
  id: string;
  title?: string;
  start?: Date;
  end?: Date;
  notes?: string | null;
};

declare global {
  interface WindowEventMap {
    "admin:events:changed": Event;
    "admin:event:edit": CustomEvent<Required<AdminEventDetail>>; // ya lo usas
    "admin:event:highlight": CustomEvent<{ id: string }>; // NUEVO
  }
}
export {};
