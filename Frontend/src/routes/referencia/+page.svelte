<script lang="ts">
  import AppFrame from '$lib/components/AppFrame.svelte';

  const referrals = [
    ['AR', 'Ana Lucía Rodríguez', 'Referencia a Neumología', 'Vence en 20 h', 'Alta'],
    ['SP', 'Sandra Patricia Pérez', 'Interconsulta a Hematología', 'En tiempo', 'Media'],
    ['JM', 'Jorge Iván Martínez', 'Referencia a Urología', 'Vence en 3 días', 'Media']
  ];
</script>

<AppFrame active="Referencia" title="Referencias y remisiones">
  <div class="heading">
    <div>
      <p class="eyebrow">CONTINUIDAD ASISTENCIAL</p>
      <h1>Referencias y remisiones</h1>
      <p class="sub">Consulta el estado de cada remisión y conserva visible el próximo paso del paciente.</p>
    </div>
    <button class="primary">+ Nueva referencia</button>
  </div>

  <section class="summary">
    <article><span>Referencias activas</span><strong>12</strong><small>4 requieren gestión hoy</small></article>
    <article><span>En autorización</span><strong>5</strong><small>2 con barrera reportada</small></article>
    <article><span>Agendadas</span><strong>7</strong><small>92% dentro del SLA</small></article>
  </section>

  <section class="list">
    <p class="eyebrow">BANDEJA DE REFERENCIAS</p>
    <h2>Próximas gestiones</h2>
    {#each referrals as referral}
      <article class="row">
        <i>{referral[0]}</i>
        <strong>{referral[1]}<small>{referral[2]}</small></strong>
        <span class="status">● {referral[3]}</span>
        <span class="priority">{referral[4]}</span>
        <b>›</b>
      </article>
    {/each}
  </section>
</AppFrame>

<style>
  .heading{display:flex;justify-content:space-between;align-items:start;gap:20px}.eyebrow{color:#008d9b;font-size:10px;letter-spacing:1.2px;font-weight:800;margin:0 0 12px}h1{font-size:34px}.sub{color:#8192a5;font-size:13px;margin:9px 0 28px}.primary{padding:13px 16px;border:0;border-radius:9px;background:#327cbb;color:#fff;font-size:10px;font-weight:800}.summary{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:18px}.summary article,.list{border:1px solid #dce6ed;border-radius:14px;background:#fff}.summary article{padding:21px;color:#748599;font-size:10px}.summary strong{display:block;margin:9px 0 5px;color:#173654;font-size:30px}.summary small{font-size:9px}.list{overflow:hidden;padding-top:22px}.list>.eyebrow,.list>h2{margin-left:21px}.list h2{font-size:18px;margin-bottom:20px}.row{display:grid;grid-template-columns:38px 1fr 150px 90px 15px;gap:15px;align-items:center;min-height:74px;padding:12px 20px;border-top:1px solid #edf1f4;color:#173957;font-size:10px}.row>i{display:grid;place-items:center;width:36px;height:36px;border-radius:9px;background:#eaf5f8;color:#234963;font-style:normal;font-weight:800}.row small{display:block;margin-top:5px;color:#8694a2;font-size:8px;font-weight:400}.status{width:max-content;padding:7px 9px;border:1px solid #c6eadc;border-radius:13px;background:#eaf9f3;color:#188c6b;font-size:9px}.priority{color:#c8751d;font-weight:800}.row>b{color:#788d9e;font-size:18px}@media(max-width:700px){.heading{display:block}.primary{margin-bottom:15px}.summary{grid-template-columns:1fr}.list{overflow-x:auto}.row{min-width:600px}}
</style>
