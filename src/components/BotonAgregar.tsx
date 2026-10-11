"use client";

import { useCarrito } from "@/context/CarritoContext";

export function BotonAgregar({
  plantillaId,
  nombre,
}: {
  plantillaId: string;
  nombre: string;
}) {
  const { agregar } = useCarrito();

  return (
    <button
      type="button"
      data-testid="btn-agregar"
      aria-label={`Agregar ${nombre} al carrito`}
      onClick={() => agregar(plantillaId)}
      className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
    >
      Agregar al carrito
    </button>
  );
}
