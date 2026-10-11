import { describe, expect, it } from "vitest";
import { calcularTotal, formatearPrecio, validarCarrito } from "./carrito";

describe("formatearPrecio", () => {
  it("formatea centavos a USD", () => {
    expect(formatearPrecio(1500)).toBe("$15.00");
    expect(formatearPrecio(0)).toBe("$0.00");
    expect(formatearPrecio(800)).toBe("$8.00");
  });
});

describe("calcularTotal", () => {
  it("suma precios del catálogo por cantidad", () => {
    expect(
      calcularTotal([
        { id: "kubernetes-cluster-overview", cantidad: 2 },
        { id: "blackbox-probes", cantidad: 1 },
      ]),
    ).toBe(1500 * 2 + 800);
  });

  it("ignora ids que no existen en el catálogo", () => {
    expect(calcularTotal([{ id: "no-existe", cantidad: 3 }])).toBe(0);
  });

  it("devuelve 0 si el carrito está vacío", () => {
    expect(calcularTotal([])).toBe(0);
  });
});

describe("validarCarrito", () => {
  it("rechaza un carrito vacío", () => {
    expect(validarCarrito([])).toEqual({
      ok: false,
      error: "El carrito está vacío",
    });
  });

  it("rechaza un valor que no es lista", () => {
    expect(validarCarrito(null).ok).toBe(false);
    expect(validarCarrito(undefined).ok).toBe(false);
  });

  it("rechaza un id inexistente", () => {
    expect(validarCarrito([{ id: "no-existe", cantidad: 1 }])).toEqual({
      ok: false,
      error: "Plantilla desconocida: no-existe",
    });
  });

  it("rechaza cantidad 0", () => {
    expect(
      validarCarrito([{ id: "nginx-ingress", cantidad: 0 }]),
    ).toEqual({
      ok: false,
      error: "La cantidad debe estar entre 1 y 10",
    });
  });

  it("rechaza cantidad 11", () => {
    expect(
      validarCarrito([{ id: "nginx-ingress", cantidad: 11 }]),
    ).toEqual({
      ok: false,
      error: "La cantidad debe estar entre 1 y 10",
    });
  });

  it("acepta cantidades en el límite 1 y 10", () => {
    const resultado = validarCarrito([
      { id: "slo-burn-rate", cantidad: 1 },
      { id: "postgresql-health", cantidad: 10 },
    ]);
    expect(resultado.ok).toBe(true);
    if (resultado.ok) {
      expect(resultado.items).toHaveLength(2);
    }
  });
});
