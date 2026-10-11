"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ItemCarrito } from "@/lib/carrito";

const STORAGE_KEY = "carrito-plantillas-sre";

type ContextoCarrito = {
  items: ItemCarrito[];
  listo: boolean;
  agregar: (id: string) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  quitar: (id: string) => void;
  vaciar: () => void;
  totalUnidades: number;
};

const CarritoContext = createContext<ContextoCarrito | null>(null);

function leerCarrito(): ItemCarrito[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const crudo = window.localStorage.getItem(STORAGE_KEY);
    if (!crudo) {
      return [];
    }
    const parsed: unknown = JSON.parse(crudo);
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

export function ProveedorCarrito({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setItems(leerCarrito());
    setListo(true);
  }, []);

  useEffect(() => {
    if (!listo) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, listo]);

  const agregar = useCallback((id: string) => {
    setItems((previos) => {
      const existente = previos.find((item) => item.id === id);
      if (existente) {
        return previos.map((item) =>
          item.id === id
            ? { ...item, cantidad: Math.min(10, item.cantidad + 1) }
            : item,
        );
      }
      return [...previos, { id, cantidad: 1 }];
    });
  }, []);

  const cambiarCantidad = useCallback((id: string, cantidad: number) => {
    const siguiente = Math.min(10, Math.max(1, Math.round(cantidad)));
    setItems((previos) =>
      previos.map((item) =>
        item.id === id ? { ...item, cantidad: siguiente } : item,
      ),
    );
  }, []);

  const quitar = useCallback((id: string) => {
    setItems((previos) => previos.filter((item) => item.id !== id));
  }, []);

  const vaciar = useCallback(() => {
    setItems([]);
  }, []);

  const totalUnidades = useMemo(
    () => items.reduce((suma, item) => suma + item.cantidad, 0),
    [items],
  );

  const valor = useMemo(
    () => ({
      items,
      listo,
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
      totalUnidades,
    }),
    [items, listo, agregar, cambiarCantidad, quitar, vaciar, totalUnidades],
  );

  return (
    <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
  );
}

export function useCarrito(): ContextoCarrito {
  const contexto = useContext(CarritoContext);
  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de ProveedorCarrito");
  }
  return contexto;
}
