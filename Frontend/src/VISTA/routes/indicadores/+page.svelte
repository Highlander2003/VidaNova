<script lang="ts">
  import AppFrame from "$vista/components/AppFrame.svelte";
  import { indicators } from "$modelo/indicadores";
</script>

<AppFrame active="Indicadores" title="Indicadores operativos">
  <div class="heading">
    <div>
      <p class="eyebrow">VISIÓN OPERATIVA</p>
      <h1>Indicadores de navegación</h1>
      <p class="sub">
        Una lectura rápida del desempeño de la navegación oncológica y sus
        puntos de atención.
      </p>
    </div>
    <button class="period">Últimos 30 días ▾</button>
  </div>

  <section class="indicators" aria-label="Indicadores principales">
    {#each indicators as indicator}
      <article class="indicator">
        <span>{indicator[0]}</span>
        <strong>{indicator[1]}</strong>
        <small class={indicator[3]}>● {indicator[2]}</small>
        <div class="bar"><i class={indicator[3]}></i></div>
      </article>
    {/each}
  </section>

  <section class="report">
    <p class="eyebrow">RESUMEN DEL PERIODO</p>
    <h2>La operación mantiene el objetivo de continuidad</h2>
    <p>
      La mayor oportunidad está en reducir las barreras de autorización y cerrar
      los resultados pendientes antes de su vencimiento.
    </p>
    <a href="/ordenes">Revisar órdenes <span>→</span></a>
  </section>
</AppFrame>

<style>
  .heading {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 20px;
  }
  .eyebrow {
    color: #008d9b;
    font-size: 10px;
    letter-spacing: 1.2px;
    font-weight: 800;
    margin: 0 0 12px;
  }
  h1 {
    font-size: 34px;
  }
  .sub {
    color: #8192a5;
    font-size: 13px;
    margin: 9px 0 28px;
  }
  .period {
    padding: 12px 14px;
    border: 1px solid #dbe5ed;
    border-radius: 9px;
    background: #fff;
    color: #294761;
    font-size: 10px;
    font-weight: 800;
  }
  .indicators {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin-bottom: 18px;
  }
  .indicator,
  .report {
    border: 1px solid #dce6ed;
    border-radius: 14px;
    background: #fff;
  }
  .indicator {
    padding: 22px;
  }
  .indicator > span {
    display: block;
    color: #748599;
    font-size: 10px;
    font-weight: 800;
  }
  .indicator strong {
    display: block;
    margin: 12px 0 7px;
    color: #173654;
    font-size: 32px;
  }
  .indicator small {
    font-size: 9px;
    font-weight: 800;
  }
  .green {
    color: #188c6b;
  }
  .amber {
    color: #c8751d;
  }
  .red {
    color: #ce4058;
  }
  .bar {
    height: 7px;
    margin-top: 19px;
    border-radius: 5px;
    background: #edf2f5;
  }
  .bar i {
    display: block;
    height: 100%;
    border-radius: 5px;
    background: #23a37b;
  }
  .bar i.amber {
    width: 62%;
    background: #d98a2b;
  }
  .bar i.red {
    width: 43%;
    background: #d65a6d;
  }
  .report {
    padding: 25px;
  }
  .report h2 {
    font-size: 20px;
  }
  .report > p:not(.eyebrow) {
    max-width: 650px;
    color: #748599;
    font-size: 12px;
    line-height: 1.6;
  }
  .report a {
    display: inline-block;
    margin-top: 8px;
    color: #008d9b;
    font-size: 10px;
    font-weight: 800;
    text-decoration: none;
  }
  .report a span {
    margin-left: 10px;
    font-size: 17px;
  }
  @media (max-width: 700px) {
    .heading {
      display: block;
    }
    .period {
      margin-bottom: 15px;
    }
    .indicators {
      grid-template-columns: 1fr;
    }
  }
</style>
