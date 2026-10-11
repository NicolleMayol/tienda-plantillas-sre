import Link from "next/link";
import type { Plantilla } from "@/data/plantillas";
import { formatearPrecio } from "@/lib/carrito";
import { BotonAgregar } from "./BotonAgregar";

export function TarjetaPlantilla({ plantilla }: { plantilla: Plantilla }) {
  return (
    <article
      data-testid="tarjeta-plantilla"
      className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-50">
          <Link
            href={`/plantillas/${plantilla.id}`}
            className="hover:text-emerald-300"
          >
            {plantilla.nombre}
          </Link>
        </h2>
        <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-xs text-emerald-200">
          {plantilla.categoria}
        </span>
      </div>
      <p className="flex-1 text-sm text-zinc-400">{plantilla.descripcion}</p>
      <div className="flex items-center justify-between">
        <p className="font-mono text-emerald-300">
          {formatearPrecio(plantilla.precio)}
        </p>
        <BotonAgregar plantillaId={plantilla.id} nombre={plantilla.nombre} />
      </div>
    </article>
  );
}
