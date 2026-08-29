import { describe, expect, it } from "vitest";
import {
  analizarAlertaPrincipal,
  analizarTodasLasAlertas,
} from "./analizarAlertas";

describe("analizarAlertas", () => {
  it("elige ROJO aunque también existan alertas AMARILLO y VERDE", () => {
    const texto =
      "Paciente estable; se recomienda biopsia guiada y presenta hemorragia. " +
      "Revisar en control estricto.";

    const principal = analizarAlertaPrincipal(texto);
    const todas = analizarTodasLasAlertas(texto);

    expect(principal.nivel).toBe("ROJO");
    expect(principal.prioridad).toBe(1);
    expect(todas.map((alerta) => alerta.nivel)).toEqual(
      expect.arrayContaining(["ROJO", "AMARILLO", "VERDE"]),
    );
  });

  it("devuelve NORMAL cuando no hay coincidencias", () => {
    expect(analizarAlertaPrincipal("Paciente en seguimiento habitual.")).toEqual({
      nivel: "NORMAL",
      colorEmoji: "⚪",
      fraseClave: "Sin frases de alerta detectadas",
    });
  });

  it("ignora mayúsculas y reconoce tildes contempladas por el patrón", () => {
    const coincidencias = analizarTodasLasAlertas(
      "Se requiere EVALUACIÓN ADICIONAL y alta MÉDICA.",
    );

    expect(coincidencias.map((alerta) => alerta.fraseClave)).toEqual(
      expect.arrayContaining(["evaluación adicional", "alta médica"]),
    );
  });

  it("conserva los saltos de línea y no inventa frases entre líneas", () => {
    expect(analizarTodasLasAlertas("falla\nrespiratoria")).toEqual([]);
    expect(analizarTodasLasAlertas("falla respiratoria\nPaciente estable")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ nivel: "ROJO", fraseClave: "falla respiratoria" }),
        expect.objectContaining({ nivel: "VERDE", fraseClave: "paciente estable" }),
      ]),
    );
  });
});
