<script lang="ts">
  import AppFrame from "$lib/components/AppFrame.svelte";
  const orders = [
    [
      "CG",
      "Carlos Andrés Gómez",
      "VN-260812-036 · 64 años",
      "Hemicolectomía derecha",
      "2 días vencido",
      "Escalar autorización",
      "Cirugía oncológica",
    ],
    [
      "AR",
      "Ana Lucía Rodríguez",
      "VN-260811-118 · 48 años",
      "Biopsia pulmonar guiada",
      "Vence en 20 h",
      "Confirmar biopsia",
      "Referencia EPS",
    ],
    [
      "JM",
      "Jorge Iván Martínez",
      "VN-260811-104 · 71 años",
      "Resonancia de pelvis",
      "Vence en 3 días",
      "Revisar solicitud de imagen",
      "Urología",
    ],
    [
      "SP",
      "Sandra Patricia Pérez",
      "VN-260810-089 · 39 años",
      "Inmunohistoquímica",
      "En tiempo",
      "Esperar inmunohistoquímica",
      "Hematología",
    ],
  ];
</script>

<AppFrame active="Órdenes" title="Órdenes y compromisos clínicos"
  ><div class="head">
    <div>
      <p class="eyebrow">CONTINUIDAD ASISTENCIAL</p>
      <h1>Órdenes y compromisos clínicos</h1>
      <p class="sub">
        Cada orden conserva responsable, fecha límite, estado y evidencia hasta
        definir la conducta posterior.
      </p>
    </div>
    <button class="export">Exportar seguimiento</button>
  </div>
  <div class="order-grid">
    <section class="selected">
      <p class="eyebrow">ORDEN SELECCIONADA</p>
      <h2>
        Implantación de catéter venoso central <span>● En autorización</span>
      </h2>
      <div class="patient">
        <i>ML</i><strong
          >María Fernanda López<small>VN-260812-041 · 57 años</small></strong
        >
      </div>
      <div class="progress">
        ✓　━━━━　✓　━━━━　✓　━━━━　✓　━━━━　○　━━━━　○　━━━━　○　━━━━　○
      </div>
      <div class="labels">
        <span>Intención documentada</span><span>Conciliación</span><span
          >Orden formalizada</span
        ><span>En autorización</span><span>Lista para agendar</span><span
          >Agendada</span
        ><span>Prestada</span><span>Resultado disponible</span>
      </div>
    </section>
    <aside class="next">
      <p class="eyebrow">PRÓXIMA ACCIÓN</p>
      <h2>Confirmar autorización de la EPS</h2>
      <div class="deadline">
        FECHA LÍMITE<strong>Hoy · 4:00 p. m.</strong><small
          >● 5 h restantes</small
        >
      </div>
      <p>Responsable <b>Laura Giraldo · Navegadora</b></p>
      <p>EPS <b>Salud Vida EPS</b></p>
      <p>Radicado <b>#894103</b></p>
      <button>Registrar gestión</button><button class="secondary"
        >Escalar barrera</button
      >
    </aside>
  </div>
  <section class="orders">
    <p class="eyebrow">BANDEJA DE ÓRDENES</p>
    <h2>Otros compromisos próximos a vencer</h2>
    {#each orders as order}<article>
        <i>{order[0]}</i><strong>{order[1]}<small>{order[2]}</small></strong
        ><strong>{order[3]}<small>{order[6]}</small></strong><span
          class:green={order[4] === "En tiempo"}
          class="status">● {order[4]}</span
        ><strong>{order[5]}<small>›</small></strong><b>›</b>
      </article>{/each}
  </section></AppFrame
>

<style>
  .head {
    display: flex;
    justify-content: space-between;
    align-items: start;
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
  .export {
    padding: 12px 15px;
    border: 1px solid #dbe5ed;
    border-radius: 9px;
    background: #fff;
    color: #294761;
    font-size: 10px;
    font-weight: 800;
  }
  .order-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 330px;
    gap: 18px;
  }
  .selected,
  .next,
  .orders {
    border: 1px solid #dce6ed;
    border-radius: 14px;
    background: #fff;
  }
  .selected {
    padding: 22px;
    min-height: 420px;
  }
  .selected h2 {
    font-size: 17px;
  }
  .selected h2 span {
    float: right;
    padding: 6px 9px;
    border-radius: 10px;
    background: #fff5e9;
    color: #c97620;
    font-size: 9px;
  }
  .patient {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px;
    margin-top: 28px;
    border-radius: 9px;
    background: #f6f9fb;
  }
  .patient i {
    display: grid;
    place-items: center;
    width: 33px;
    height: 33px;
    border-radius: 9px;
    background: #eaf5f8;
    color: #234963;
    font-style: normal;
    font-size: 10px;
    font-weight: 800;
  }
  .patient strong {
    font-size: 10px;
  }
  .patient small {
    display: block;
    color: #8795a4;
    font-size: 8px;
    margin-top: 4px;
    font-weight: 400;
  }
  .progress {
    margin-top: 32px;
    color: #15926e;
    font-size: 17px;
    white-space: nowrap;
    overflow: hidden;
  }
  .labels {
    display: flex;
    justify-content: space-between;
    color: #6e8295;
    font-size: 8px;
    text-align: center;
  }
  .labels span {
    max-width: 78px;
  }
  .next {
    padding: 22px;
  }
  .next h2 {
    font-size: 17px;
  }
  .deadline {
    margin: 16px 0;
    padding: 16px;
    border: 1px solid #f3d2ac;
    border-radius: 9px;
    background: #fff6ea;
    color: #c2792a;
    font-size: 8px;
  }
  .deadline strong {
    display: block;
    margin: 7px 0;
    color: #173653;
    font-size: 14px;
  }
  .deadline small {
    padding: 4px;
    border-radius: 8px;
    background: #fff0f2;
    color: #cf4055;
    font-size: 8px;
  }
  .next p:not(.eyebrow) {
    padding: 10px 0;
    border-bottom: 1px solid #edf1f4;
    color: #7f8d9c;
    font-size: 9px;
  }
  .next p b {
    float: right;
    color: #183b58;
  }
  .next button {
    width: 100%;
    padding: 12px;
    margin-top: 10px;
    border: 0;
    border-radius: 8px;
    background: #327cbb;
    color: #fff;
    font-size: 10px;
    font-weight: 800;
  }
  .next .secondary {
    background: #fff;
    border: 1px solid #dce5ed;
    color: #234460;
  }
  .orders {
    margin-top: 18px;
    overflow: hidden;
    padding-top: 22px;
  }
  .orders > .eyebrow,
  .orders > h2 {
    margin-left: 21px;
  }
  .orders h2 {
    font-size: 17px;
    margin-bottom: 20px;
  }
  .orders article {
    display: grid;
    grid-template-columns: 38px 1fr 1.2fr 1fr 1fr 15px;
    gap: 15px;
    align-items: center;
    min-height: 74px;
    padding: 12px 20px;
    border-top: 1px solid #edf1f4;
    font-size: 10px;
  }
  .orders article > i {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background: #eaf5f8;
    color: #234963;
    font-style: normal;
    font-weight: 800;
  }
  .orders small {
    display: block;
    color: #8694a2;
    font-size: 8px;
    margin-top: 4px;
    font-weight: 400;
  }
  .status {
    width: max-content;
    padding: 7px 9px;
    border: 1px solid #f3cbd2;
    border-radius: 13px;
    background: #fff0f2;
    color: #ce3e55;
    font-size: 9px;
  }
  .status.green {
    border-color: #c6eadc;
    background: #eaf9f3;
    color: #188c6b;
  }
  .orders article > b {
    color: #788d9e;
  }
  @media (max-width: 850px) {
    .head {
      display: block;
    }
    .export {
      margin-bottom: 15px;
    }
    .order-grid {
      grid-template-columns: 1fr;
    }
    .selected {
      min-height: 300px;
    }
    .orders {
      overflow-x: auto;
    }
    .orders article {
      min-width: 760px;
    }
  }
</style>
