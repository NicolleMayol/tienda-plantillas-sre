import Link from "next/link";

export default function CanceladoPage() {
  return (
    <section className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold">Pago cancelado</h1>
      <p className="mt-3 text-zinc-400">
        No se realizó ningún cargo. Tu carrito se conserva.
      </p>
      <Link
        href="/carrito"
        className="mt-6 inline-block rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500"
      >
        Volver al carrito
      </Link>
    </section>
  );
}
