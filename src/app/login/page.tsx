import Link from "next/link";

export default function Login() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        Acceder
      </h1>
      <Link
        href="/api/auth/signin?callbackUrl=/admin/calendario"
        style={{
          display: "inline-block",
          background: "black",
          color: "white",
          padding: "8px 16px",
          borderRadius: 8,
          textDecoration: "none",
        }}
      >
        Entrar con Google
      </Link>
    </main>
  );
}
