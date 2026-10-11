import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold">Página no encontrada</h1>
      <p className="mt-3 text-zinc-400">Esa plantilla no existe en el catálogo.</p>
      <Link href="/" className="mt-6 inline-block text-emerald-300">
        Volver al catálogo
      </Link>
    </section>
  );
}
