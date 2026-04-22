import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/modules/auth/adapters/output/next-auth/auth.config";

export default async function AdminLanding({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const resolvedSearchParams = (await searchParams) ?? {};
  const hasAccessDenied = resolvedSearchParams.error === "AccessDenied";
  if (session?.user?.role === "ADMIN") {
    redirect("/admin/calendario");
  }

  return (
    <main className="container mx-auto p-6 space-y-4">
      {hasAccessDenied && (
        <div className="fixed right-4 top-4 z-50 max-w-sm rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-lg">
          Acceso denegado. Tu cuenta de Google no tiene permisos de
          administración.
        </div>
      )}

      <h1 className="text-2xl font-bold">Área de administración</h1>
      <p>Inicia sesión con Google para gestionar el calendario.</p>
      <Link
        href="/api/auth/signin?callbackUrl=/admin/calendario"
        className="inline-block rounded bg-black text-white px-4 py-2"
      >
        Entrar con Google
      </Link>
    </main>
  );
}
