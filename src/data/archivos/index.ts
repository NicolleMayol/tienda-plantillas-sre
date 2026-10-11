// Las plantillas viven fuera de public/ para que Next.js no las sirva sin control.
// Se importan de forma estática para que queden dentro del bundle del servidor.
import blackboxProbes from "./blackbox-probes.json";
import kubernetesClusterOverview from "./kubernetes-cluster-overview.json";
import nginxIngress from "./nginx-ingress.json";
import nodeExporterFull from "./node-exporter-full.json";
import postgresqlHealth from "./postgresql-health.json";
import sloBurnRate from "./slo-burn-rate.json";

export const archivosPlantillas: Record<string, unknown> = {
  "blackbox-probes": blackboxProbes,
  "kubernetes-cluster-overview": kubernetesClusterOverview,
  "nginx-ingress": nginxIngress,
  "node-exporter-full": nodeExporterFull,
  "postgresql-health": postgresqlHealth,
  "slo-burn-rate": sloBurnRate,
};
