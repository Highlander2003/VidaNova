export type NivelAlerta = "ROJO" | "AMARILLO" | "VERDE" | "NORMAL";

type NivelClasificable = Exclude<NivelAlerta, "NORMAL">;

export const CONFIG_NIVELES: Record<
  NivelClasificable,
  { colorEmoji: string; prioridad: number }
> = {
  ROJO: { colorEmoji: "🔴", prioridad: 1 },
  AMARILLO: { colorEmoji: "🟡", prioridad: 2 },
  VERDE: { colorEmoji: "🟢", prioridad: 3 },
};

/** Patrones equivalentes a MATRIZ_ALERTAS de PalabrasClave.py. */
export const MATRIZ_ALERTAS: { patron: RegExp; nivel: NivelClasificable }[] = [
  // Nivel ROJO
  { patron: /cat[eé]ter venoso implantable/gi, nivel: "ROJO" },
  { patron: /urgente/gi, nivel: "ROJO" },
  { patron: /falla respiratoria/gi, nivel: "ROJO" },
  { patron: /deterioro cl[ií]nico/gi, nivel: "ROJO" },
  { patron: /ingreso hospitalario/gi, nivel: "ROJO" },
  { patron: /hospitalizado/gi, nivel: "ROJO" },
  { patron: /UCI/gi, nivel: "ROJO" },
  { patron: /urgencia vital/gi, nivel: "ROJO" },
  { patron: /shock/gi, nivel: "ROJO" },
  { patron: /insuficiencia/gi, nivel: "ROJO" },
  { patron: /hemorragia/gi, nivel: "ROJO" },
  { patron: /paro cardiorrespiratorio/gi, nivel: "ROJO" },

  // Nivel AMARILLO
  { patron: /si persiste el dolor/gi, nivel: "AMARILLO" },
  { patron: /nueva biopsia/gi, nivel: "AMARILLO" },
  { patron: /control estricto/gi, nivel: "AMARILLO" },
  { patron: /revisar en/gi, nivel: "AMARILLO" },
  { patron: /segunda opini[oó]n/gi, nivel: "AMARILLO" },
  { patron: /manejo ambulatorio/gi, nivel: "AMARILLO" },
  { patron: /falta de respuesta/gi, nivel: "AMARILLO" },
  { patron: /procedimiento programado/gi, nivel: "AMARILLO" },
  { patron: /control en/gi, nivel: "AMARILLO" },
  { patron: /se discute caso/gi, nivel: "AMARILLO" },
  { patron: /evaluaci[oó]n adicional/gi, nivel: "AMARILLO" },

  // Nivel VERDE
  { patron: /biopsia guiada/gi, nivel: "VERDE" },
  { patron: /hallazgo sospechoso/gi, nivel: "VERDE" },
  { patron: /evoluci[oó]n favorable/gi, nivel: "VERDE" },
  { patron: /sin complicaciones/gi, nivel: "VERDE" },
  { patron: /tratamiento establecido/gi, nivel: "VERDE" },
  { patron: /derivaci[oó]n a especialista/gi, nivel: "VERDE" },
  { patron: /control en [0-9] d[ií]as/gi, nivel: "VERDE" },
  { patron: /paciente estable/gi, nivel: "VERDE" },
  { patron: /citolog[ií]a/gi, nivel: "VERDE" },
  { patron: /ex[aá]menes de laboratorio/gi, nivel: "VERDE" },
  { patron: /manejo sintom[aá]tico/gi, nivel: "VERDE" },
  { patron: /alta m[eé]dica/gi, nivel: "VERDE" },
];
