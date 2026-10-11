import { NextResponse } from "next/server";
import { archivosPlantillas } from "@/data/archivos";
import { obtenerPlantilla } from "@/data/plantillas";
import { autorizarDescarga } from "@/lib/descargas";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const plantilla = obtenerPlantilla(id);
  const contenido = archivosPlantillas[id];
  if (!plantilla || contenido === undefined) {
    return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 });
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Falta session_id" }, { status: 401 });
  }

  let sesion;
  try {
    sesion = await getStripe().checkout.sessions.retrieve(sessionId);
  } catch {
    return NextResponse.json({ error: "Sesión de pago inválida" }, { status: 403 });
  }

  if (!autorizarDescarga(sesion, id)) {
    return NextResponse.json(
      { error: "La sesión no incluye esta plantilla o no está pagada" },
      { status: 403 },
    );
  }

  return new NextResponse(JSON.stringify(contenido, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${plantilla.archivo}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
