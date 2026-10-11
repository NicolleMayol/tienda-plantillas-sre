"use client";

import { useMemo, useState } from "react";
import { categoriasUnicas, plantillas } from "@/data/plantillas";
import { TarjetaPlantilla } from "./TarjetaPlantilla";

export function Catalogo() {
  const [categoria, setCategoria] = useState("todas");
  const categorias = useMemo(() => categoriasUnicas(), []);

  const visibles =
    categoria === "todas"
      ? plantillas
      : plantillas.filter((plantilla) => plantilla.categoria === categoria);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-50">
            Plantillas de Grafana
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-400">
            Dashboards listos para un equipo SRE. Pago de prueba con Stripe
            Checkout.
          </p>
        </div>
        <div>
          <label htmlFor="filtro-categoria" className="mb-1 block text-sm text-zinc-400">
            Categoría
          </label>
          <select
            id="filtro-categoria"
            data-testid="filtro-categoria"
            aria-label="Filtrar por categoría"
            value={categoria}
            onChange={(evento) => setCategoria(evento.target.value)}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
          >
            <option value="todas">Todas</option>
            {categorias.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((plantilla) => (
          <TarjetaPlantilla key={plantilla.id} plantilla={plantilla} />
        ))}
      </div>
    </section>
  );
}
