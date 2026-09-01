<script lang="ts">
  import { onMount } from "svelte";
  import {
    dashboardNavItems,
    workItems,
    formatCurrentDate,
  } from "$modelo/navigation";

  let activeItem = "Centro de navegación";
  let search = "";
  let currentDate = formatCurrentDate(new Date());

  onMount(() => {
    const updateDate = () => {
      currentDate = formatCurrentDate(new Date());
    };
    const timer = window.setInterval(updateDate, 60 * 1000);
    return () => window.clearInterval(timer);
  });
</script>

<svelte:head>
  <title>Vidanova Navigator</title>
</svelte:head>

<div class="app-shell">
  <aside class="sidebar">
    <a class="brand" href="/" aria-label="Ir al inicio"
      ><span class="symbol">✦</span><strong>vidanova</strong></a
    >
    <p class="tagline">Plataforma de navegación oncológica</p>

    <nav aria-label="Navegación principal">
      {#each dashboardNavItems as item}
        <a
          class:active={activeItem === item.label}
          class="nav-item"
          href={item.href}
        >
          <span class="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
          {#if item.count}<b title={item.countLabel}>{item.count}</b>{/if}
        </a>
      {/each}
    </nav>

    <div class="sidebar-footer">
      <div class="connection">
        <i></i><span>SIISA conectado</span><small>Demo</small>
      </div>
      <div class="profile">
        <div class="avatar">LG</div>
        <div><strong>Laura Giraldo</strong><span>Navegadora líder</span></div>
        <button aria-label="Más opciones">⋮</button>
      </div>
    </div>
  </aside>

  <section class="content-area">
    <header class="topbar">
      <label class="search-box">
        <span>⌕</span>
        <input
          bind:value={search}
          placeholder="Buscar paciente, identificación o diagnóstico"
          aria-label="Buscar paciente"
        />
        <kbd>⌘ K</kbd>
      </label>
      <div class="top-actions">
        <button class="notification" aria-label="Notificaciones"
          ><span>♢</span><b>8</b></button
        >
      </div>
    </header>

    <main class="dashboard">
      <div class="heading-row">
        <div>
          <p class="eyebrow">{currentDate}</p>
          <h1>Buenos días, equipo de Navegación</h1>
          <p class="subtitle">
            Esta es la situación operativa que requiere atención hoy.
          </p>
        </div>
        <a
          class="patients-link"
          href="/pacientes"
          style="text-decoration: none;"
          >Ver todos los pacientes <span>→</span></a
        >
      </div>

      <section class="metrics" aria-label="Resumen operativo">
        <article class="metric featured">
          <div class="metric-icon">◉</div>
          <span>Casos activos</span><strong>124</strong><small
            ><em>+8</em> desde ayer</small
          >
        </article>
        <article class="metric">
          <div class="metric-icon danger">!</div>
          <span>Acciones vencidas</span><strong>9</strong><small
            class="danger-text">3 requieren escalamiento</small
          >
        </article>
        <article class="metric">
          <div class="metric-icon warning">↔</div>
          <span>Posibles omisiones</span><strong>6</strong><small
            >2 detectadas en la última hora</small
          >
        </article>
        <article class="metric">
          <div class="metric-icon info">□</div>
          <span>Pendientes de resultado</span><strong>18</strong><small
            ><em>92%</em> dentro del SLA</small
          >
        </article>
      </section>

      <div class="lower-grid">
        <section class="work-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">BANDEJA PRIORIZADA</p>
              <h2>Requieren acción ahora</h2>
            </div>
            <div class="legend">
              <span><i class="red-dot"></i> Crítico</span><span
                ><i class="amber-dot"></i> Próximo a vencer</span
              >
            </div>
          </div>
          <div class="work-list">
            {#each workItems as item}
              <button
                class="work-row"
                aria-label={`Abrir caso de ${item.name}`}
              >
                <div class="patient">
                  <span class="patient-avatar">{item.initials}</span><span
                    ><strong>{item.name}</strong><small
                      >{item.record} · {item.age}</small
                    ></span
                  >
                </div>
                <span class="service">{item.service}</span>
                <span class="statuses"
                  ><small class={`pill ${item.priorityTone}`}
                    >● {item.priority}</small
                  ><small class={`pill ${item.slaTone}`}>● {item.sla}</small
                  ></span
                >
                <span class="action"
                  ><strong>{item.action}</strong><small>{item.elapsed}</small
                  ></span
                >
                <span class="chevron">›</span>
              </button>
            {/each}
          </div>
          <button class="view-queue">Ver bandeja completa <span>→</span></button
          >
        </section>

        <aside class="alert-card">
          <div class="alert-icon">!</div>
          <p class="eyebrow">ALERTA CLÍNICA-OPERATIVA</p>
          <h2>Una conducta podría no haberse convertido en orden</h2>
          <p>
            En la evolución de María F. López se identificó una indicación de
            catéter venoso, sin orden formal equivalente en SIISA.
          </p>
          <button>Revisar conciliación <span>→</span></button>
          <div class="card-orbit"></div>
        </aside>
      </div>
    </main>
  </section>
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap");

  :global(*) {
    box-sizing: border-box;
  }
  :global(body) {
    margin: 0;
    background: #f5f8fb;
    color: #0d294a;
    font-family: "DM Sans", sans-serif;
  }
  :global(button),
  :global(input) {
    font: inherit;
  }
  button {
    cursor: pointer;
  }
  .app-shell {
    min-height: 100vh;
    display: flex;
  }
  .sidebar {
    width: 296px;
    flex: 0 0 296px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    color: #dae8f3;
    background: #082643;
  }
  .brand {
    height: 99px;
    border-radius: 14px;
    background: #fff;
    color: #38529a;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-family: Georgia, serif;
    font-size: 29px;
  }
  .symbol {
    font-size: 45px;
    transform: rotate(-25deg);
  }
  .tagline {
    margin: 8px 0 25px;
    color: #9bb3c5;
    text-align: center;
    font-size: 9px;
    font-weight: 700;
  }
  nav {
    padding: 0 12px;
  }
  .nav-item {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    gap: 17px;
    margin-bottom: 6px;
    padding: 14px 14px;
    border: 0;
    border-left: 3px solid transparent;
    border-radius: 12px;
    color: #b6c6d5;
    background: transparent;
    text-align: left;
    text-decoration: none;
    font-weight: 700;
    font-size: 15px;
  }
  .nav-item:hover,
  .nav-item.active {
    color: #fff;
    background: #0b4565;
    border-left-color: #00bac6;
  }
  .nav-icon {
    width: 19px;
    color: #62d7df;
    font-size: 22px;
    text-align: center;
  }
  .nav-item b {
    margin-left: auto;
    padding: 3px 8px;
    border-radius: 10px;
    color: #d6e3ec;
    background: #304d67;
    font-size: 11px;
  }
  .sidebar-footer {
    margin-top: auto;
    padding: 16px 14px 20px;
  }
  .connection {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 0 7px 15px;
    color: #9bb5c8;
    font-size: 11px;
  }
  .connection i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #46ddb2;
    box-shadow: 0 0 0 4px rgba(70, 221, 178, 0.13);
  }
  .connection small {
    margin-left: auto;
    padding: 5px 7px;
    border-radius: 4px;
    background: #29455d;
  }
  .profile {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 11px;
    border-radius: 12px;
    background: #133a5a;
  }
  .avatar,
  .patient-avatar {
    display: grid;
    place-items: center;
    border-radius: 9px;
    color: #83dbe0;
    background: #25536c;
    font-size: 11px;
    font-weight: 800;
  }
  .avatar {
    width: 35px;
    height: 35px;
  }
  .profile strong,
  .profile span {
    display: block;
  }
  .profile strong {
    color: #f4f8fb;
    font-size: 12px;
  }
  .profile span {
    margin-top: 4px;
    color: #9bb7ca;
    font-size: 10px;
  }
  .profile button {
    margin-left: auto;
    border: 0;
    color: #b8d2df;
    background: none;
    font-size: 20px;
  }
  .content-area {
    min-width: 0;
    flex: 1;
  }
  .topbar {
    height: 82px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 0 38px;
    border-bottom: 1px solid #dfe7ee;
    background: #fff;
  }
  .search-box {
    width: min(568px, 50vw);
    height: 49px;
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 0 14px;
    border: 1px solid #dce6ee;
    border-radius: 12px;
    color: #368cc6;
    box-shadow: 0 2px 8px rgba(17, 45, 75, 0.03);
  }
  .search-box > span {
    font-size: 27px;
    transform: rotate(-20deg);
  }
  .search-box input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    color: #183b60;
    font-size: 13px;
  }
  .search-box input::placeholder {
    color: #8da1b4;
  }
  kbd {
    padding: 4px 7px;
    border: 1px solid #dfe7ee;
    border-radius: 5px;
    color: #8da0b3;
    font-size: 11px;
  }
  .top-actions {
    display: flex;
    align-items: center;
    gap: 11px;
  }
  .notification {
    position: relative;
    width: 47px;
    height: 47px;
    border: 1px solid #dce6ee;
    border-radius: 11px;
    color: #294964;
    background: #fff;
    font-size: 22px;
  }
  .notification b {
    position: absolute;
    top: -5px;
    right: -5px;
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    color: #fff;
    background: #ce4058;
    font-size: 10px;
  }
  .dashboard {
    max-width: 1420px;
    margin: 0 auto;
    padding: 40px 39px 55px;
  }
  .heading-row {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 31px;
  }
  .eyebrow {
    margin: 0 0 12px;
    color: #008e9c;
    font-size: 11px;
    letter-spacing: 1.3px;
    font-weight: 800;
  }
  h1,
  h2 {
    margin: 0;
    font-family: "Manrope", sans-serif;
    letter-spacing: -1.1px;
  }
  h1 {
    color: #0b294d;
    font-size: clamp(27px, 2.55vw, 38px);
    font-weight: 800;
  }
  .subtitle {
    margin: 9px 0 0;
    color: #778da4;
    font-size: 14px;
  }
  .patients-link {
    padding: 14px 18px;
    border: 1px solid #dbe5ed;
    border-radius: 11px;
    color: #173653;
    background: #fff;
    font-size: 12px;
    font-weight: 800;
    white-space: nowrap;
  }
  .patients-link span,
  .view-queue span,
  .alert-card button span {
    margin-left: 12px;
    font-size: 18px;
  }
  .metrics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 21px;
  }
  .metric {
    position: relative;
    min-height: 149px;
    padding: 33px 23px 18px;
    border: 1px solid #e0e8ef;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 8px 20px rgba(20, 52, 81, 0.025);
  }
  .metric.featured {
    color: #fff;
    border: 0;
    background: linear-gradient(120deg, #0b294d, #0b345d);
    box-shadow: 0 13px 25px rgba(10, 42, 74, 0.16);
  }
  .metric > span {
    display: block;
    color: #718096;
    font-size: 12px;
    font-weight: 800;
  }
  .metric.featured > span {
    color: #d4e1ea;
  }
  .metric strong {
    display: block;
    margin-top: 14px;
    font-family: "Manrope", sans-serif;
    font-size: 36px;
    line-height: 1;
  }
  .metric small {
    display: block;
    margin-top: 9px;
    color: #8999aa;
    font-size: 10px;
  }
  .metric.featured small {
    color: #a9c1d0;
  }
  .metric small em {
    color: #35b49a;
    font-style: normal;
    font-weight: 800;
  }
  .danger-text {
    color: #dd5c6b !important;
  }
  .metric-icon {
    position: absolute;
    top: 22px;
    right: 23px;
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    color: #7ae1e1;
    background: #1d526d;
    font-size: 15px;
  }
  .metric-icon.danger {
    color: #d4495c;
    background: #fff0f2;
    font-size: 18px;
  }
  .metric-icon.warning {
    color: #dc771b;
    background: #fff5e9;
    font-size: 18px;
  }
  .metric-icon.info {
    color: #268d99;
    background: #e8f8f9;
  }
  .lower-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 350px;
    gap: 21px;
  }
  .work-panel {
    overflow: hidden;
    border: 1px solid #dfe8ef;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 10px 26px rgba(24, 53, 80, 0.04);
  }
  .panel-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 93px;
    padding: 19px 26px;
    border-bottom: 1px solid #ebf0f4;
  }
  .panel-heading .eyebrow {
    margin-bottom: 10px;
  }
  .panel-heading h2 {
    font-size: 19px;
    font-weight: 600;
  }
  .legend {
    display: flex;
    gap: 19px;
    color: #8393a5;
    font-size: 10px;
  }
  .legend i {
    display: inline-block;
    width: 9px;
    height: 9px;
    margin-right: 6px;
    border-radius: 50%;
  }
  .red-dot {
    background: #d33c55;
  }
  .amber-dot {
    background: #cf7215;
  }
  .work-row {
    width: 100%;
    display: grid;
    grid-template-columns: 1.55fr 1fr 1.05fr 1.2fr 14px;
    align-items: center;
    gap: 14px;
    min-height: 89px;
    padding: 14px 24px 14px 26px;
    border: 0;
    border-bottom: 1px solid #ebf0f4;
    color: #133452;
    background: #fff;
    text-align: left;
  }
  .work-row:hover {
    background: #f8fbfc;
  }
  .patient,
  .patient > span:last-child {
    display: flex;
    align-items: center;
  }
  .patient {
    gap: 13px;
  }
  .patient > span:last-child {
    display: block;
    min-width: 0;
  }
  .patient-avatar {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    color: #254b68;
    background: #eaf5f8;
  }
  .patient strong,
  .action strong {
    display: block;
    color: #173452;
    font-size: 11px;
    white-space: nowrap;
  }
  .patient small,
  .action small {
    display: block;
    margin-top: 4px;
    color: #8391a1;
    font-size: 9px;
  }
  .service {
    color: #758397;
    font-size: 10px;
    font-weight: 700;
  }
  .statuses {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: start;
  }
  .pill {
    padding: 4px 8px;
    border-radius: 10px;
    font-size: 9px;
    font-weight: 700;
    white-space: nowrap;
  }
  .pill.red {
    color: #d13e56;
    border: 1px solid #f4ccd3;
    background: #fff0f2;
  }
  .pill.amber {
    color: #c8751d;
    border: 1px solid #f4d5b4;
    background: #fff6ea;
  }
  .pill.green {
    color: #1b986f;
    border: 1px solid #bfe8db;
    background: #ecfbf7;
  }
  .chevron {
    color: #9eabba;
    font-size: 23px;
  }
  .view-queue {
    width: 100%;
    padding: 16px;
    border: 0;
    color: #008d9b;
    background: #fff;
    font-size: 11px;
    font-weight: 800;
  }
  .alert-card {
    position: relative;
    overflow: hidden;
    min-height: 370px;
    padding: 54px 30px 27px;
    border-radius: 16px;
    color: #d9e9f2;
    background: linear-gradient(145deg, #0c3657, #075d6d);
  }
  .alert-icon {
    position: absolute;
    top: 53px;
    left: 30px;
    display: grid;
    place-items: center;
    width: 45px;
    height: 45px;
    border: 9px solid rgba(218, 77, 100, 0.22);
    border-radius: 12px;
    color: #fff;
    background: #c6415b;
    font-size: 19px;
    font-weight: 700;
  }
  .alert-card .eyebrow {
    margin-top: 65px;
    color: #7fe0e1;
  }
  .alert-card h2 {
    max-width: 275px;
    color: #fff;
    font-size: 21px;
    line-height: 1.32;
    font-weight: 600;
  }
  .alert-card > p:not(.eyebrow) {
    position: relative;
    max-width: 290px;
    margin: 17px 0 22px;
    color: #adc6d2;
    font-size: 12px;
    line-height: 1.6;
  }
  .alert-card button {
    position: relative;
    padding: 13px 17px;
    border: 0;
    border-radius: 10px;
    color: #173b58;
    background: #fff;
    font-size: 11px;
    font-weight: 800;
  }
  .card-orbit {
    position: absolute;
    right: -70px;
    bottom: -118px;
    width: 245px;
    height: 245px;
    border: 1px solid rgba(147, 221, 223, 0.15);
    border-radius: 50%;
  }
  .card-orbit::after {
    content: "";
    position: absolute;
    inset: 28px;
    border: 1px solid rgba(147, 221, 223, 0.12);
    border-radius: 50%;
  }
  @media (max-width: 1100px) {
    .sidebar {
      width: 235px;
      flex-basis: 235px;
    }
    .topbar {
      padding: 0 24px;
    }
    .dashboard {
      padding: 32px 24px;
    }
    .lower-grid {
      grid-template-columns: 1fr;
    }
    .alert-card {
      min-height: 300px;
    }
    .metrics {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 720px) {
    .app-shell {
      display: block;
    }
    .sidebar {
      width: 100%;
      min-height: auto;
    }
    .brand {
      height: 58px;
      font-size: 25px;
    }
    .symbol {
      font-size: 35px;
    }
    .sidebar nav {
      display: flex;
      overflow-x: auto;
      gap: 6px;
      padding: 0 10px 10px;
    }
    .nav-item {
      min-width: max-content;
      width: auto;
      margin: 0;
      padding: 10px 12px;
    }
    .nav-item b {
      display: none;
    }
    .sidebar-footer {
      display: none;
    }
    .topbar {
      height: auto;
      flex-wrap: wrap;
      padding: 14px 16px;
      gap: 12px;
    }
    .search-box {
      width: 100%;
      order: 1;
    }
    .top-actions {
      width: 100%;
      justify-content: flex-end;
      order: 0;
    }
    .dashboard {
      padding: 28px 16px;
    }
    .heading-row {
      align-items: start;
      flex-direction: column;
      margin-bottom: 23px;
    }
    .patients-link {
      align-self: stretch;
    }
    .metrics {
      gap: 10px;
    }
    .metric {
      min-height: 135px;
      padding: 25px 15px 15px;
    }
    .metric strong {
      font-size: 30px;
    }
    .metric-icon {
      top: 16px;
      right: 15px;
    }
    .metric > span {
      max-width: 90px;
    }
    .panel-heading {
      align-items: start;
      flex-direction: column;
      gap: 14px;
      padding: 19px;
    }
    .legend {
      padding-bottom: 3px;
    }
    .work-panel {
      overflow-x: auto;
    }
    .work-list {
      min-width: 720px;
    }
    .view-queue {
      min-width: 720px;
    }
    .alert-card {
      min-height: 340px;
    }
  }
  @media (max-width: 430px) {
    .notification {
      flex: 0 0 47px;
    }
    .metrics {
      grid-template-columns: 1fr 1fr;
    }
    .metric {
      min-height: 130px;
    }
    .metric small {
      font-size: 9px;
    }
  }
  .brand {
    margin: 12px;
  }
</style>
