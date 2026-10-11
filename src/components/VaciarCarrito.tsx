"use client";

import { useEffect } from "react";
import { useCarrito } from "@/context/CarritoContext";

export function VaciarCarrito() {
  const { vaciar, listo } = useCarrito();

  useEffect(() => {
    if (listo) {
      vaciar();
    }
  }, [listo, vaciar]);

  return null;
}
