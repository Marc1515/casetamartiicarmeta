"use client";
import { useEffect, useMemo, useState } from "react";
import type { Evt } from "./CalendarAdmin";

type FormState = {
  title: string;
  start: string; // "YYYY-MM-DDTHH:mm" local
  end: string; // "YYYY-MM-DDTHH:mm" local
  notes: string;
};

function roundToNext30m(date = new Date()) {
  const d = new Date(date);
  d.setSeconds(0, 0);
  const minutes = d.getMinutes();
  const toAdd = minutes % 30 === 0 ? 0 : 30 - (minutes % 30);
  d.setMinutes(minutes + toAdd);
  return d;
}

function toInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${y}-${m}-${day}T${h}:${min}`;
}

export default function ReservaForm() {
  const startDefault = useMemo(() => roundToNext30m(), []);
  const endDefault = useMemo(() => {
    const d = new Date(startDefault);
    d.setHours(d.getHours() + 2);
    return d;
  }, [startDefault]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    title: "Reserva",
    start: toInputValue(startDefault),
    end: toInputValue(endDefault),
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  function onChange<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  // Escucha "admin:event:edit" para entrar en modo edición con el evento clicado
  useEffect(() => {
    const handler = (ev: CustomEvent<Evt>) => {
      const e = ev.detail;
      setEditingId(e.id);
      setForm({
        title: e.title,
        start: toInputValue(e.start),
        end: toInputValue(e.end),
        notes: e.notes ?? "",
      });
    };
    window.addEventListener("admin:event:edit", handler as EventListener);
    return () =>
      window.removeEventListener("admin:event:edit", handler as EventListener);
  }, []);

  async function createOrUpdate(method: "POST" | "PUT", id?: string) {
    const start = new Date(form.start);
    const end = new Date(form.end);

    if (!form.title.trim()) throw new Error("El título es obligatorio.");
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
      throw new Error("Fechas/horas inválidas.");
    if (end <= start)
      throw new Error("La hora de fin debe ser posterior al inicio.");

    const url =
      method === "POST" ? "/api/admin/events" : `/api/admin/events/${id}`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title.trim(),
        start: start.toISOString(),
        end: end.toISOString(),
        allDay: false,
        notes: form.notes.trim() || null,
      }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      throw new Error(data.error ?? "Error al guardar.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOkMsg(null);
    setSubmitting(true);
    try {
      if (editingId) {
        await createOrUpdate("PUT", editingId);
        setOkMsg("Reserva actualizada ✅");
      } else {
        await createOrUpdate("POST");
        setOkMsg("Reserva creada ✅");
      }
      // Notifica y deja el formulario listo
      window.dispatchEvent(new Event("admin:events:changed"));
      if (!editingId) {
        setForm((f) => ({ ...f, title: "Reserva", notes: "" }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de red o servidor.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!editingId) return;
    if (!confirm("¿Seguro que quieres eliminar esta reserva?")) return;
    setError(null);
    setOkMsg(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/events/${editingId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Error al eliminar.");
      }
      window.dispatchEvent(new Event("admin:events:changed"));
      // Sal del modo edición
      setEditingId(null);
      setForm({
        title: "Reserva",
        start: toInputValue(startDefault),
        end: toInputValue(endDefault),
        notes: "",
      });
      setOkMsg("Reserva eliminada ✅");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de red o servidor.");
    } finally {
      setSubmitting(false);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({
      title: "Reserva",
      start: toInputValue(startDefault),
      end: toInputValue(endDefault),
      notes: "",
    });
  }

  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold mb-3">
        {editingId ? "Editar reserva" : "Nueva reserva (día y hora)"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            className="w-full border rounded p-2"
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Reserva"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Inicio</label>
            <input
              type="datetime-local"
              className="w-full border rounded p-2"
              value={form.start}
              onChange={(e) => onChange("start", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fin</label>
            <input
              type="datetime-local"
              className="w-full border rounded p-2"
              value={form.end}
              onChange={(e) => onChange("end", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notas (solo admin)
          </label>
          <textarea
            className="w-full border rounded p-2"
            rows={3}
            value={form.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder="Observaciones internas…"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {okMsg && <p className="text-green-700 text-sm">{okMsg}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
          >
            {submitting
              ? "Guardando..."
              : editingId
              ? "Guardar cambios"
              : "Crear reserva"}
          </button>

          {editingId && (
            <>
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded border px-4 py-2"
              >
                Cancelar edición
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded border px-4 py-2 text-red-600 border-red-300"
                disabled={submitting}
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      </form>
    </section>
  );
}
