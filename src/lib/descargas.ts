import type { ItemCarrito } from "@/lib/carrito";

export type SesionPago = {
  payment_status: string | null;
  metadata?: Record<string, string> | null;
};

/** Lee las plantillas compradas desde la metadata de la Checkout Session. */
export function plantillasCompradas(metadata: string | null | undefined): ItemCarrito[] {
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

/** Solo se descarga una plantilla si la sesión está pagada y la incluye. */
export function autorizarDescarga(sesion: SesionPago, idPlantilla: string): boolean {
  if (sesion.payment_status !== "paid") {
    return false;
  }
  return plantillasCompradas(sesion.metadata?.plantillas).some(
    (item) => item.id === idPlantilla,
  );
}
