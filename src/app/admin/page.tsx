import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminLanding() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role === "ADMIN") {
    redirect("/admin/calendario");
  }

  return (
    <main className="container mx-auto p-6 space-y-4">
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
