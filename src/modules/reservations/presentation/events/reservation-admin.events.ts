export type AdminReservationEditDetail = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    notes?: string | null;
};

export type AdminReservationHighlightDetail = {
    id: string;
};

const ADMIN_RESERVATIONS_CHANGED_EVENT = "admin:events:changed";
const ADMIN_RESERVATION_EDIT_EVENT = "admin:event:edit";
const ADMIN_RESERVATION_HIGHLIGHT_EVENT = "admin:event:highlight";

export function emitAdminReservationsChanged(): void {
    window.dispatchEvent(new Event(ADMIN_RESERVATIONS_CHANGED_EVENT));
}

export function onAdminReservationsChanged(
    handler: () => void,
): () => void {
    window.addEventListener(ADMIN_RESERVATIONS_CHANGED_EVENT, handler);

    return () => {
        window.removeEventListener(ADMIN_RESERVATIONS_CHANGED_EVENT, handler);
    };
}

export function emitAdminReservationEdit(
    detail: AdminReservationEditDetail,
): void {
    window.dispatchEvent(
        new CustomEvent<AdminReservationEditDetail>(
            ADMIN_RESERVATION_EDIT_EVENT,
            {
                detail,
            },
        ),
    );
}

export function onAdminReservationEdit(
    handler: (detail: AdminReservationEditDetail) => void,
): () => void {
    const listener = (event: Event) => {
        const customEvent = event as CustomEvent<AdminReservationEditDetail>;
        handler(customEvent.detail);
    };

    window.addEventListener(ADMIN_RESERVATION_EDIT_EVENT, listener);

    return () => {
        window.removeEventListener(ADMIN_RESERVATION_EDIT_EVENT, listener);
    };
}

export function emitAdminReservationHighlight(
    detail: AdminReservationHighlightDetail,
): void {
    window.dispatchEvent(
        new CustomEvent<AdminReservationHighlightDetail>(
            ADMIN_RESERVATION_HIGHLIGHT_EVENT,
            {
                detail,
            },
        ),
    );
}

export function onAdminReservationHighlight(
    handler: (detail: AdminReservationHighlightDetail) => void,
): () => void {
    const listener = (event: Event) => {
        const customEvent = event as CustomEvent<AdminReservationHighlightDetail>;
        handler(customEvent.detail);
    };

    window.addEventListener(ADMIN_RESERVATION_HIGHLIGHT_EVENT, listener);

    return () => {
        window.removeEventListener(ADMIN_RESERVATION_HIGHLIGHT_EVENT, listener);
    };
}