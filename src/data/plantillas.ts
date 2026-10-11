export type Plantilla = {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  archivo: string;
};

export const plantillas: Plantilla[] = [
  {
    id: "kubernetes-cluster-overview",
    nombre: "Kubernetes Cluster Overview",
    descripcion:
      "Vista general del clúster: nodos, pods, CPU y memoria para detectar saturación a tiempo.",
    categoria: "Kubernetes",
    precio: 1500,
    archivo: "kubernetes-cluster-overview.json",
  },
  {
    id: "postgresql-health",
    nombre: "PostgreSQL Health",
    descripcion:
      "Salud de PostgreSQL: conexiones, locks, replicación y uso de disco.",
    categoria: "Bases de datos",
    precio: 1200,
    archivo: "postgresql-health.json",
  },
  {
    id: "node-exporter-full",
    nombre: "Node Exporter Full",
    descripcion:
      "Métricas de host con Node Exporter: CPU, RAM, disco, red y saturación.",
    categoria: "Infraestructura",
    precio: 900,
    archivo: "node-exporter-full.json",
  },
  {
    id: "slo-burn-rate",
    nombre: "SLO Burn Rate",
    descripcion:
      "Quema de error budget a ventanas corta y larga para alertas multi-window.",
    categoria: "SLO",
    precio: 2000,
    archivo: "slo-burn-rate.json",
  },
  {
    id: "nginx-ingress",
    nombre: "NGINX Ingress",
    descripcion:
      "Latencia, tasa de error y throughput del Ingress NGINX en Kubernetes.",
    categoria: "Kubernetes",
    precio: 1100,
    archivo: "nginx-ingress.json",
  },
  {
    id: "blackbox-probes",
    nombre: "Blackbox Probes",
    descripcion:
      "Disponibilidad HTTP/TCP/ICMP con Blackbox Exporter y probes sintéticos.",
    categoria: "Disponibilidad",
    precio: 800,
    archivo: "blackbox-probes.json",
  },
];

export function obtenerPlantilla(id: string): Plantilla | undefined {
  return plantillas.find((plantilla) => plantilla.id === id);
}

export function categoriasUnicas(): string[] {
  return [...new Set(plantillas.map((plantilla) => plantilla.categoria))];
}
