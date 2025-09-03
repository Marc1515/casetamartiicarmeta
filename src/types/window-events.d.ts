// src/types/window-events.d.ts
type AdminEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  notes?: string | null;
};

declare global {
  interface WindowEventMap {
    "admin:events:changed": Event;
    "admin:event:edit": CustomEvent<AdminEvent>;
  }
}

export {};
