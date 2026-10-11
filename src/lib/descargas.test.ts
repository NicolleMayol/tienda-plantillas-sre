import { describe, expect, it } from "vitest";
import { autorizarDescarga, plantillasCompradas } from "@/lib/descargas";

const metadata = JSON.stringify([{ id: "slo-burn-rate", cantidad: 1 }]);

describe("plantillasCompradas", () => {
  it("lee los ítems de la metadata", () => {
    expect(plantillasCompradas(metadata)).toEqual([{ id: "slo-burn-rate", cantidad: 1 }]);
  });

  it("devuelve vacío con metadata ausente o corrupta", () => {
    expect(plantillasCompradas(undefined)).toEqual([]);
    expect(plantillasCompradas("{no es json")).toEqual([]);
    expect(plantillasCompradas('{"id":"x"}')).toEqual([]);
  });
});

describe("autorizarDescarga", () => {
  it("autoriza una plantilla comprada en una sesión pagada", () => {
    expect(autorizarDescarga({ payment_status: "paid", metadata: { plantillas: metadata } }, "slo-burn-rate")).toBe(true);
  });

  it("rechaza si la sesión no está pagada", () => {
    expect(autorizarDescarga({ payment_status: "unpaid", metadata: { plantillas: metadata } }, "slo-burn-rate")).toBe(false);
  });

  it("rechaza una plantilla que no está en la compra", () => {
    expect(autorizarDescarga({ payment_status: "paid", metadata: { plantillas: metadata } }, "nginx-ingress")).toBe(false);
  });

  it("rechaza si la sesión no trae metadata", () => {
    expect(autorizarDescarga({ payment_status: "paid", metadata: null }, "slo-burn-rate")).toBe(false);
  });
});
