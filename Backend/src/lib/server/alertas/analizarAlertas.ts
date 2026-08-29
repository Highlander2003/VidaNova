import {
  alertasService,
  type CoincidenciaAlerta,
  type ResultadoAlerta,
} from "./AlertasService";

export type { CoincidenciaAlerta, ResultadoAlerta } from "./AlertasService";

/**
 * Detector heurístico de apoyo (Eje A / Eje C); no es un diagnóstico
 * ni una decisión clínica automática.
 */
export function analizarTodasLasAlertas(texto: string): CoincidenciaAlerta[] {
  return alertasService.analizarTodas(texto);
}

export function analizarAlertaPrincipal(
  texto: string,
): ResultadoAlerta {
  return alertasService.analizarPrincipal(texto);
}
