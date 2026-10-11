"use client";

import Link from "next/link";
import { useCarrito } from "@/context/CarritoContext";

export function Encabezado() {
  const { totalUnidades } = useCarrito();

  return (
    <header className="border-b border-emerald-900/60 bg-zinc-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold tracking-tight text-emerald-300">
          Tienda de Plantillas SRE
        </Link>
        <Link
          href="/carrito"
          className="rounded-md border border-emerald-700 px-3 py-1.5 text-sm text-emerald-100 hover:bg-emerald-950"
          aria-label={`Carrito, ${totalUnidades} artículos`}
        >
          Carrito{" "}
          <span data-testid="contador-carrito" className="font-mono">
            ({totalUnidades})
          </span>
        </Link>
      </div>
    </header>
  );
}
