"use client";

import { useEffect, useRef, useState } from "react";

type UseNavbarMenuResult = {
    open: boolean;
    setOpen: (open: boolean) => void;
    closeBtnRef: React.RefObject<HTMLButtonElement | null>;
};

export function useNavbarMenu(): UseNavbarMenuResult {
    const [open, setOpen] = useState(false);
    const closeBtnRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";

        if (open) {
            setTimeout(() => closeBtnRef.current?.focus(), 0);
        }

        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        if (open) {
            addEventListener("keydown", onKeyDown);
        }

        return () => {
            document.body.style.overflow = "";
            removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    return {
        open,
        setOpen,
        closeBtnRef,
    };
}