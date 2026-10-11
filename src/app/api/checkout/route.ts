import { NextResponse } from "next/server";
import { obtenerPlantilla } from "@/data/plantillas";
import { validarCarrito } from "@/lib/carrito";
import { getStripe, urlDelSitio } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const itemsCuerpo =
    typeof cuerpo === "object" && cuerpo !== null && "items" in cuerpo
      ? cuerpo.items
      : undefined;

  const validacion = validarCarrito(itemsCuerpo);
  if (!validacion.ok) {
    return NextResponse.json({ error: validacion.error }, { status: 400 });
  }

  const sitio = urlDelSitio();
  const stripe = getStripe();

  const line_items = validacion.items.map((item) => {
    const plantilla = obtenerPlantilla(item.id);
    if (!plantilla) {
      throw new Error(`Plantilla desapareció del catálogo: ${item.id}`);
    }
    return {
      quantity: item.cantidad,
      price_data: {
        currency: "usd",
        unit_amount: plantilla.precio,
        product_data: {
          name: plantilla.nombre,
          description: plantilla.descripcion,
          metadata: { plantilla_id: plantilla.id },
        },
      },
    };
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: `${sitio}/exito?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${sitio}/cancelado`,
    metadata: {
      plantillas: JSON.stringify(validacion.items),
    },
    integration_identifier: "tienda-sre-kqmzrwvb",
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Stripe no devolvió una URL de Checkout" },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}
