import Link from "next/link";
import { VaciarCarrito } from "@/components/VaciarCarrito";
import { obtenerPlantilla } from "@/data/plantillas";
import { formatearPrecio, type ItemCarrito } from "@/lib/carrito";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

function MensajeError() {
  return (
    <section className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1
        data-testid="mensaje-error-pago"
        className="text-3xl font-semibold text-red-300"
      >
        No pudimos confirmar tu pago
      </h1>
      <Link href="/carrito" className="mt-6 inline-block text-emerald-300">
        Volver al carrito
      </Link>
    </section>
  );
}

function parsearPlantillas(metadata: string | null | undefined): ItemCarrito[] {
  if (!metadata) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(metadata);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (item): item is ItemCarrito =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.cantidad === "number",
    );
  } catch {
    return [];
  }
}

export default async function ExitoPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    return <MensajeError />;
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return <MensajeError />;
    }

    const compradas = parsearPlantillas(session.metadata?.plantillas);
    const total = session.amount_total ?? 0;

    return (
      <section className="mx-auto max-w-xl px-4 py-16">
        <VaciarCarrito />
        <h1 data-testid="mensaje-exito" className="text-3xl font-semibold">
          Pago confirmado
        </h1>
        <p className="mt-3 text-zinc-300">Total: {formatearPrecio(total)}</p>
        <ul className="mt-6 space-y-2">
          {compradas.map((item) => {
            const plantilla = obtenerPlantilla(item.id);
            if (!plantilla) {
              return null;
            }
            return (
              <li key={plantilla.id}>
                <a
                  href={`/plantillas/${plantilla.archivo}`}
                  download
                  className="text-emerald-300 underline"
                >
                  Descargar {plantilla.nombre}
                </a>
              </li>
            );
          })}
        </ul>
        <Link href="/" className="mt-8 inline-block text-sm text-zinc-400">
          Volver al catálogo
        </Link>
      </section>
    );
  } catch {
    return <MensajeError />;
  }
}
