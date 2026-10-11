import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Encabezado } from "@/components/Encabezado";
import { ProveedorCarrito } from "@/context/CarritoContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tienda de Plantillas SRE",
  description:
    "Compra plantillas de dashboards de Grafana para equipos SRE. Pagos de prueba con Stripe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-950 text-zinc-100 antialiased`}
      >
        <ProveedorCarrito>
          <Encabezado />
          <main>{children}</main>
        </ProveedorCarrito>
      </body>
    </html>
  );
}
