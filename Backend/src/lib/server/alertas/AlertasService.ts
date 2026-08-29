import {
  CONFIG_NIVELES,
  MATRIZ_ALERTAS,
  type NivelAlerta,
} from "./matrizAlertas";

export type ReglaAlerta = {
  patron: RegExp;
  nivel: Exclude<NivelAlerta, "NORMAL">;
};

export type CoincidenciaAlerta = {
  nivel: Exclude<NivelAlerta, "NORMAL">;
  colorEmoji: string;
  fraseClave: string;
};

export type ResultadoAlerta = {
  nivel: NivelAlerta;
  colorEmoji: string;
  fraseClave: string;
  prioridad?: number;
};

/** Servicio de detección para apoyo humano, no diagnóstico automático. */
export class AlertasService {
  private readonly reglas: ReglaAlerta[];

  constructor(reglas: ReglaAlerta[] = MATRIZ_ALERTAS) {
    this.reglas = reglas;
  }

  analizarTodas(texto: string): CoincidenciaAlerta[] {
    const textoNormalizado = texto.toLowerCase();
    return this.reglas.flatMap(({ patron, nivel }) => {
      patron.lastIndex = 0;
      const coincidencias = [...textoNormalizado.matchAll(patron)].map(
        (coincidencia) => ({
          nivel,
          colorEmoji: CONFIG_NIVELES[nivel].colorEmoji,
          fraseClave: coincidencia[0],
        }),
      );
      patron.lastIndex = 0;
      return coincidencias;
    });
  }

  analizarPrincipal(texto: string): ResultadoAlerta {
    const coincidencias = this.analizarTodas(texto);
    if (coincidencias.length === 0) {
      return {
        nivel: "NORMAL",
        colorEmoji: "⚪",
        fraseClave: "Sin frases de alerta detectadas",
      };
    }

    const principal = coincidencias.reduce((actual, candidata) =>
      CONFIG_NIVELES[candidata.nivel].prioridad <
      CONFIG_NIVELES[actual.nivel].prioridad
        ? candidata
        : actual,
    );
    return {
      ...principal,
      prioridad: CONFIG_NIVELES[principal.nivel].prioridad,
    };
  }
}

export const alertasService = new AlertasService();
