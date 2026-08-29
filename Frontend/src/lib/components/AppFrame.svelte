<script lang="ts">
  import { onMount } from 'svelte';

  export let active = 'Centro de navegación';
  export let title = 'Vidanova Navigator';
  export let whatsappUnreadCount = 0;
  const backendUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';
  let backendConnected = false;

  async function checkBackend() {
    try {
      const response = await fetch(`${backendUrl}/api/health`);
      backendConnected = response.ok;
    } catch {
      backendConnected = false;
    }
  }

  onMount(() => {
    void checkBackend();
    const timer = window.setInterval(checkBackend, 30_000);
    return () => window.clearInterval(timer);
  });

  const items = [
    { label: 'Centro de navegación', icon: '⌂', href: '/' },
    { label: 'Conciliación', icon: '↔', count: 6, countLabel: 'Historias clínicas pendientes de verificación humana', href: '/conciliacion' },
    { label: 'Pacientes', icon: '◎', count: 124, href: '/pacientes' },
    { label: 'Órdenes', icon: '▤', count: 27, href: '/ordenes' },
    { label: 'Referencia', icon: '↗', count: 12, href: '/referencia' },
    { label: 'CRM WhatsApp', icon: '◉', count: whatsappUnreadCount, href: '/whatsapp' },
    { label: 'Indicadores', icon: '▥', href: '/indicadores' }
  ];
</script>

<svelte:head><title>{title} | Vidanova</title></svelte:head>

<div class="frame">
  <aside class="sidebar">
    <a class="brand" href="/" aria-label="Ir al inicio"><span class="symbol">✦</span><strong>vidanova</strong></a>
    <p class="tagline">Plataforma de navegación oncológica</p>
    <nav aria-label="Navegación principal">
      {#each items as item}
        <a class:active={active === item.label} class="nav-item" href={item.href}>
          <span class="icon">{item.icon}</span><span>{item.label}</span>{#if item.count}<b title={item.countLabel}>{item.count}</b>{/if}
        </a>
      {/each}
    </nav>
    <div class="user-area"><div class="connection"><i></i> SIISA conectado <small>Demo</small></div><div class="user"><span>LG</span><strong>Laura Giraldo<small>Navegadora líder</small></strong><b>⋮</b></div></div>
  </aside>
  <section class="main">
    <header class="topbar"><label class="search">⌕ <input placeholder="Buscar paciente, identificación o diagnóstico" aria-label="Buscar" /><kbd>⌘ K</kbd></label><span class:offline={!backendConnected} class="backend-status">{backendConnected ? 'Backend conectado' : 'Backend no Conectado'}</span></header>
    <main class="page"><slot /></main>
  </section>
</div>

<style>
  :global(*){box-sizing:border-box}:global(body){margin:0;background:#f5f8fb;color:#102d50;font-family:'DM Sans','Segoe UI',sans-serif}:global(button),:global(input){font:inherit}.frame{min-height:100vh;display:flex}.sidebar{width:296px;flex:0 0 296px;background:#082643;color:#dae8f3;display:flex;flex-direction:column;padding:0}.brand{height:99px;border-radius:14px;background:#fff;color:#38529a;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:4px;font-family:Georgia,serif;font-size:29px}.symbol{font-size:45px;transform:rotate(-25deg)}.tagline{text-align:center;color:#9bb3c5;font-size:9px;font-weight:700;margin:8px 0 25px}.connection i{display:inline-block;width:7px;height:7px;border-radius:50%;background:#47dbb4;margin-right:7px}nav{padding:0 12px}.nav-item{width:100%;height:auto;display:flex;align-items:center;gap:17px;margin-bottom:6px;padding:14px 14px;border:0;border-left:3px solid transparent;border-radius:12px;color:#b6c6d5;background:transparent;text-align:left;text-decoration:none;font-weight:700;font-size:15px}.nav-item:hover,.nav-item.active{background:#0b4565;color:#fff;border-left-color:#00bac6}.nav-item .icon{width:19px;text-align:center;color:#62d7df;font-size:22px}.nav-item b{margin-left:auto;background:#304d67;color:#d6e3ec;border-radius:10px;padding:3px 8px;font-size:11px}.user-area{margin-top:auto}.connection{font-size:9px;padding:14px 7px;color:#a5bbc9}.connection small{float:right;background:#2a465e;padding:4px 7px;border-radius:4px}.user{display:flex;align-items:center;gap:10px;padding:11px;border-radius:11px;background:#153957;font-size:10px}.user>span{display:grid;place-items:center;width:34px;height:34px;border-radius:8px;background:#12536a;color:#81dce0}.user strong{color:#fff}.user strong small{display:block;color:#a7bdcc;margin-top:4px;font-weight:400}.user>b{margin-left:auto;font-size:18px}.main{min-width:0;flex:1}.topbar{height:67px;background:#fff;border-bottom:1px solid #e0e8ee;display:flex;align-items:center;justify-content:space-between;padding:0 30px;gap:20px}.search{height:42px;width:min(470px,50vw);border:1px solid #dbe5ed;border-radius:11px;display:flex;align-items:center;gap:12px;padding:0 12px;color:#247bb8;font-size:24px}.search input{flex:1;min-width:0;border:0;outline:0;font-size:12px;color:#183b60}.search input::placeholder{color:#90a3b5}.search kbd{font-size:10px;border:1px solid #e0e7ed;border-radius:4px;padding:4px;color:#8393a4}.backend-status{flex:0 0 auto;padding:10px 12px;border:1px solid #bfe8d4;border-radius:9px;color:#198d6c;background:#ebfaf3;font-size:10px;font-weight:800}.backend-status.offline{border-color:#f1cbd2;color:#ce4058;background:#fff0f2}.top-actions{display:flex;align-items:center;gap:10px}.top-actions>small{background:#f0f3f6;border-radius:8px;padding:8px;color:#728192;font-size:9px;font-weight:800}.top-actions button{height:42px;border:1px solid #b5e5ea;border-radius:10px;background:#effcfd;color:#00889a;font-size:11px;font-weight:800;padding:0 15px}.top-actions .bell{position:relative;width:43px;padding:0;background:#fff;border-color:#dce5ec;color:#24445d;font-size:19px}.bell b{position:absolute;right:-5px;top:-7px;width:17px;height:17px;display:grid;place-items:center;border-radius:50%;background:#cf4058;color:#fff;font-size:9px}.page{max-width:1450px;margin:auto;padding:38px 32px}.eyebrow{color:#008d9b;font-size:10px;letter-spacing:1.2px;font-weight:800;margin:0 0 12px}h1,h2{font-family:'Segoe UI',sans-serif;letter-spacing:-1.2px;margin:0}h1{font-size:34px;color:#0d294c}h2{font-size:20px;font-weight:500}.sub{color:#8192a5;font-size:13px;margin:9px 0 28px}@media(max-width:1100px){.sidebar{width:235px;flex-basis:235px}.topbar{padding:0 24px}.page{padding:32px 24px}}@media(max-width:720px){.frame{display:block}.sidebar{width:100%;padding:10px}.brand{height:58px}.tagline,.user-area{display:none}.sidebar nav{display:flex;overflow:auto;gap:4px}.nav-item{min-width:max-content;margin:0;padding:0 9px}.nav-item b{display:none}.topbar{height:auto;padding:12px;flex-wrap:wrap}.search{order:2;width:100%}.backend-status{order:1}.page{padding:24px 12px}h1{font-size:27px}}
  .brand { margin: 12px; }
</style>
