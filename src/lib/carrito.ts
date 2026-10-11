import { obtenerPlantilla } from "@/data/plantillas";

export type ItemCarrito = {
  id: string;
  cantidad: number;
};

export type ResultadoValidacion =
  | { ok: true; items: ItemCarrito[] }
  | { ok: false; error: string };

export function formatearPrecio(centavos: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(centavos / 100);
}

export function calcularTotal(items: ItemCarrito[]): number {
  return items.reduce((total, item) => {
    const plantilla = obtenerPlantilla(item.id);
    if (!plantilla) {
      return total;
    }
    return total + plantilla.precio * item.cantidad;
  }, 0);
}

export function validarCarrito(items: unknown): ResultadoValidacion {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: "El carrito está vacío" };
  }

  const validados: ItemCarrito[] = [];

  for (const item of items) {
    if (
      item === null ||
      typeof item !== "object" ||
      typeof (item as ItemCarrito).id !== "string" ||
      typeof (item as ItemCarrito).cantidad !== "number"
    ) {
      return { ok: false, error: "Ítem de carrito inválido" };
    }

    const { id, cantidad } = item as ItemCarrito;

    if (!obtenerPlantilla(id)) {
      return { ok: false, error: `Plantilla desconocida: ${id}` };
    }

    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 10) {
      return { ok: false, error: "La cantidad debe estar entre 1 y 10" };
    }

    validados.push({ id, cantidad });
  }

  return { ok: true, items: validados };
}
