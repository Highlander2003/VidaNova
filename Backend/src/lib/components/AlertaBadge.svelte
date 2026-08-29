<script lang="ts">
  import type { NivelAlerta } from "$lib/server/alertas/matrizAlertas";

  export let nivel: NivelAlerta;

  const colores: Record<NivelAlerta, string> = {
    ROJO: "#ef4444",
    AMARILLO: "#eab308",
    VERDE: "#22c55e",
    NORMAL: "#9ca3af",
  };
</script>

<span
  class="badge"
  style={`background-color: ${colores[nivel]}`}
  aria-label={`Nivel de alerta: ${nivel}`}
>
  {nivel}
</span>

<style>
  .badge {
    display: inline-block;
    border-radius: 999px;
    padding: 0.25rem 0.65rem;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1.2;
    text-transform: uppercase;
  }
</style>
