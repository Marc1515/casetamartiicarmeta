"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin" })}
      className="rounded px-3 py-2 border"
      title="Cerrar sesión"
    >
      Cerrar sesión
    </button>
  );
}
