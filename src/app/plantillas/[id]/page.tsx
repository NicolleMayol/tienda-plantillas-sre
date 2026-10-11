import { notFound } from "next/navigation";
import { BotonAgregar } from "@/components/BotonAgregar";
import { obtenerPlantilla, plantillas } from "@/data/plantillas";
import { formatearPrecio } from "@/lib/carrito";

export function generateStaticParams() {
  return plantillas.map((plantilla) => ({ id: plantilla.id }));
}

export default async function DetallePlantillaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plantilla = obtenerPlantilla(id);

  if (!plantilla) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-sm uppercase tracking-wide text-emerald-400">
        {plantilla.categoria}
      </p>
      <h1 className="mt-2 text-3xl font-semibold">{plantilla.nombre}</h1>
      <p className="mt-4 text-zinc-400">{plantilla.descripcion}</p>
      <p className="mt-6 font-mono text-2xl text-emerald-300">
        {formatearPrecio(plantilla.precio)}
      </p>
      <div className="mt-6">
        <BotonAgregar plantillaId={plantilla.id} nombre={plantilla.nombre} />
      </div>
    </article>
  );
}
