"use client";

import { useState } from "react";
import Link from "next/link";
import { obtenerPlantilla } from "@/data/plantillas";
import { useCarrito } from "@/context/CarritoContext";
import { calcularTotal, formatearPrecio } from "@/lib/carrito";

export function ListaCarrito() {
  const { items, cambiarCantidad, quitar } = useCarrito();
  const [error, setError] = useState<string | null>(null);
  const [pagando, setPagando] = useState(false);
  const vacio = items.length === 0;
  const total = calcularTotal(items);

  async function pagar() {
    setError(null);
    setPagando(true);
    try {
      const respuesta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ id, cantidad }) => ({ id, cantidad })),
        }),
      });
      const datos: unknown = await respuesta.json();
      if (
        !respuesta.ok ||
        typeof datos !== "object" ||
        datos === null ||
        !("url" in datos) ||
        typeof datos.url !== "string"
      ) {
        const mensaje =
          typeof datos === "object" &&
          datos !== null &&
          "error" in datos &&
          typeof datos.error === "string"
            ? datos.error
            : "No se pudo iniciar el pago";
        setError(mensaje);
        return;
      }
      window.location.href = datos.url;
    } catch {
      setError("No se pudo iniciar el pago");
    } finally {
      setPagando(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-semibold">Carrito</h1>
      {vacio ? (
        <p className="mb-6 text-zinc-400">Tu carrito está vacío</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => {
            const plantilla = obtenerPlantilla(item.id);
            if (!plantilla) {
              return null;
            }
            return (
              <li
                key={item.id}
                data-testid="item-carrito"
                className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <Link
                    href={`/plantillas/${plantilla.id}`}
                    className="font-medium hover:text-emerald-300"
                  >
                    {plantilla.nombre}
                  </Link>
                  <p className="text-sm text-zinc-400">{plantilla.categoria}</p>
                  <p className="font-mono text-sm text-emerald-300">
                    {formatearPrecio(plantilla.precio * item.cantidad)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label htmlFor={`cantidad-${item.id}`} className="text-sm">
                    Cantidad
                  </label>
                  <input
                    id={`cantidad-${item.id}`}
                    data-testid="input-cantidad"
                    type="number"
                    min={1}
                    max={10}
                    value={item.cantidad}
                    aria-label={`Cantidad de ${plantilla.nombre}`}
                    onChange={(evento) =>
                      cambiarCantidad(item.id, Number(evento.target.value))
                    }
                    className="w-16 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1"
                  />
                  <button
                    type="button"
                    data-testid="btn-quitar"
                    aria-label={`Quitar ${plantilla.nombre} del carrito`}
                    onClick={() => quitar(item.id)}
                    className="text-sm text-red-300 hover:text-red-200"
                  >
                    Quitar
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p data-testid="total-carrito" className="mt-6 text-xl font-semibold">
        Total: {formatearPrecio(total)}
      </p>
      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
      <button
        type="button"
        data-testid="btn-pagar"
        aria-label="Pagar con Stripe"
        disabled={vacio || pagando}
        onClick={pagar}
        className="mt-6 rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-zinc-700"
      >
        {pagando ? "Redirigiendo…" : "Pagar con Stripe"}
      </button>
    </section>
  );
}
