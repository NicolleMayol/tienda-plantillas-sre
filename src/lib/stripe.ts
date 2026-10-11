import Stripe from "stripe";

export function getStripe(): Stripe {
  const clave = process.env.STRIPE_SECRET_KEY;
  if (!clave) {
    throw new Error("Falta la variable STRIPE_SECRET_KEY");
  }
  return new Stripe(clave);
}

export function urlDelSitio(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002";
}
