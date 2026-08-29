<script lang="ts">
  import AppFrame from "$lib/components/AppFrame.svelte";
  import { onMount } from "svelte";

  type Message = {
    id: string;
    from: string;
    text: string;
    timestamp: string;
    direction: "inbound" | "outbound";
    read: boolean;
  };
  type Conversation = {
    id: string;
    phone: string;
    name?: string;
    lastMessage?: Message;
    unreadCount: number;
    messages: Message[];
  };
  const backendUrl = import.meta.env.PUBLIC_API_URL || "http://localhost:3001";
  let conversations: Conversation[] = [];
  let selectedPhone = "";
  let backendConnected = false;
  let apiConfigured = false;
  $: selectedConversation = conversations.find(
    (conversation) => conversation.phone === selectedPhone,
  );
  $: unreadCount = conversations.reduce(
    (total, conversation) => total + conversation.unreadCount,
    0,
  );

  async function loadConversations() {
    try {
      const response = await fetch(`${backendUrl}/api/whatsapp/conversations`);
      if (!response.ok) throw new Error("Backend no Conectado");
      const result = (await response.json()) as {
        conversations: Conversation[];
        configured: boolean;
      };
      conversations = result.conversations;
      apiConfigured = result.configured;
      backendConnected = true;
      if (!selectedPhone && conversations[0])
        selectedPhone = conversations[0].phone;
    } catch {
      backendConnected = false;
    }
  }

  async function selectConversation(phone: string) {
    selectedPhone = phone;
    await fetch(
      `${backendUrl}/api/whatsapp/conversations?phone=${encodeURIComponent(phone)}`,
    );
    await loadConversations();
  }

  onMount(() => {
    void loadConversations();
    const timer = window.setInterval(loadConversations, 15_000);
    return () => window.clearInterval(timer);
  });
</script>

<AppFrame active="CRM WhatsApp" title="CRM de WhatsApp">
  <div class="heading">
    <div>
      <p class="eyebrow">CRM INTEGRADO VIDANOVA</p>
      <h1>CRM de WhatsApp y continuidad del paciente</h1>
      <p class="sub">
        Convierte cada conversación en un proceso identificable, asignable,
        agendable y conectado con la navegación clínica.
      </p>
    </div>
    <span class="connected"
      >● WhatsApp oficial<br />
      <small
        >{backendConnected && apiConfigured
          ? "API conectada"
          : "Backend no Conectado"}</small
      >
    </span>
  </div>
  <div class="switches">
    <button class="on"
      >◉ &nbsp; <strong>Bandeja WhatsApp</strong>
      <small>Conversaciones, agenda, chatbot e IA</small>
    </button><button
      >◎ &nbsp; <strong>Seguimiento clínico</strong><small
        >Tareas, barreras y continuidad asistencial</small
      ></button
    >
  </div>
  <div class="notice">
    ● &nbsp; <strong>Esperando integración.</strong> Las conversaciones aparecerán
    aquí en orden de llegada cuando se conecte la API de WhatsApp Business.
  </div>
  <section class="metrics">
    <article class="featured">
      <span>Conversaciones hoy</span><strong>—</strong><small
        >Esperando datos</small
      >
    </article>
    <article>
      <span>Tiempo de primera respuesta</span><strong>—</strong><small
        >Sin datos disponibles</small
      >
    </article>
    <article>
      <span>Citas obtenidas</span><strong>—</strong><small
        >Sin datos disponibles</small
      >
    </article>
    <article>
      <span>Oportunidades por recuperar</span><strong>—</strong><small
        >Sin datos disponibles</small
      >
    </article>
  </section>
  <div class="chat-layout">
    <aside class="inbox">
      <p class="eyebrow">BANDEJA COMPARTIDA</p>
      <h2>Conversaciones <b class="unread-total">{unreadCount}</b></h2>
      <input placeholder="⌕  Buscar paciente o etiqueta" />
      {#each conversations as conversation}
        <button
          class:chosen={conversation.phone === selectedPhone}
          class="chat"
          onclick={() => selectConversation(conversation.phone)}
          ><i
            >{(conversation.name || conversation.phone)
              .slice(0, 2)
              .toUpperCase()}</i
          ><span
            ><strong>{conversation.name || conversation.phone}</strong><small
              >{conversation.lastMessage?.text || "Sin mensajes"}</small
            >{#if conversation.unreadCount}<em
                >{conversation.unreadCount} sin leer</em
              >{/if}</span
          ><time
            >{conversation.lastMessage
              ? new Date(conversation.lastMessage.timestamp).toLocaleTimeString(
                  "es-CO",
                  { hour: "2-digit", minute: "2-digit" },
                )
              : ""}</time
          ></button
        >
      {:else}
        <div class="waiting-state">
          <strong>Esperando conversaciones</strong><small
            >La bandeja se actualizará cuando llegue el primer mensaje desde
            WhatsApp Business.</small
          >
        </div>
      {/each}
    </aside>
    <section class="messages waiting-panel">
      {#if selectedConversation}<header class="conversation-header">
          <strong
            >{selectedConversation.name || selectedConversation.phone}</strong
          ><small>{selectedConversation.phone}</small>
        </header>
        {#each selectedConversation.messages as message}<div
            class:outbound={message.direction === "outbound"}
            class="message"
          >
            <span>{message.text}</span><small
              >{new Date(message.timestamp).toLocaleTimeString("es-CO", {
                hour: "2-digit",
                minute: "2-digit",
              })}</small
            >
          </div>{/each}{:else}<div class="waiting-state">
          <strong>Sin conversación seleccionada</strong><small
            >Los mensajes recibidos aparecerán aquí automáticamente.</small
          >
        </div>{/if}
    </section>
    <aside class="contact waiting-panel">
      {#if selectedConversation}<div class="waiting-state">
          <strong>{selectedConversation.name || "Paciente sin nombre"}</strong
          ><small>WhatsApp Business · {selectedConversation.phone}</small>
        </div>{:else}<div class="waiting-state">
          <strong>Sin paciente seleccionado</strong><small
            >La información del paciente se mostrará al recibir una
            conversación.</small
          >
        </div>{/if}
    </aside>
  </div></AppFrame
>

<style>
  .heading {
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
  .connected {
    background: #eaf9f2;
    color: #216b53;
    border: 1px solid #bfe8d4;
    border-radius: 10px;
    padding: 12px 25px;
    font-size: 11px;
    font-weight: 800;
  }
  .connected small {
    font-size: 9px;
  }
  .switches {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }
  .switches button {
    position: relative;
    text-align: left;
    border: 1px solid #dce6ed;
    background: #fff;
    border-radius: 13px;
    padding: 17px;
    color: #123654;
    font-size: 18px;
  }
  .switches .on {
    border-color: #08b2bd;
    box-shadow: inset 4px 0 #00b2bd;
  }
  .switches strong {
    font-size: 12px;
  }
  .switches small {
    display: block;
    margin: 5px 0 0 28px;
    color: #8a99a8;
    font-size: 9px;
  }
  .switches b {
    position: absolute;
    right: 20px;
    top: 23px;
    color: #198b9a;
    font-size: 10px;
  }
  .flow,
  .notice,
  .metrics article,
  .inbox,
  .messages,
  .contact {
    border: 1px solid #dde7ee;
    border-radius: 14px;
    background: #fff;
  }
  .flow {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 21px;
    color: #8a9baa;
  }
  .flow span {
    display: flex;
    gap: 10px;
    color: #1692a0;
    font-size: 20px;
  }
  .flow strong {
    font-size: 8px;
    color: #8191a3;
  }
  .flow b {
    color: #183b5d;
    font-size: 10px;
  }
  .notice {
    margin: 12px 0 17px;
    padding: 13px;
    color: #55728b;
    font-size: 10px;
  }
  .metrics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
  .metrics article {
    padding: 25px;
    min-height: 130px;
  }
  .metrics span,
  .metrics small {
    display: block;
    color: #76879a;
    font-size: 11px;
  }
  .metrics strong {
    display: block;
    margin: 14px 0 7px;
    font-size: 31px;
  }
  .metrics .featured {
    background: #0b294d;
    color: #fff;
  }
  .featured span,
  .featured small {
    color: #d1e2eb;
  }
  .chat-layout {
    display: grid;
    grid-template-columns: 315px minmax(300px, 1fr) 300px;
    gap: 14px;
  }
  .inbox,
  .messages,
  .contact {
    overflow: hidden;
  }
  .inbox {
    padding-top: 20px;
  }
  .inbox .eyebrow,
  .inbox h2,
  .inbox input {
    margin-left: 20px;
    margin-right: 20px;
  }
  .inbox h2 {
    font-size: 20px;
    font-weight: 500;
    margin-top: 0;
  }
  .inbox h2 button {
    float: right;
    border: 0;
    border-radius: 8px;
    background: #08adbb;
    color: #fff;
    font-size: 22px;
    width: 35px;
  }
  .inbox input {
    width: calc(100% - 40px);
    padding: 12px;
    border: 1px solid #dce6ed;
    border-radius: 9px;
    font-size: 10px;
    margin-bottom: 10px;
  }
  .chat {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 17px;
    border: 0;
    border-left: 3px solid transparent;
    background: #fff;
    text-align: left;
  }
  .chat.chosen {
    border-left-color: #00b6bf;
    background: #effafb;
  }
  .chat i,
  .messages header i,
  .contact > i {
    display: grid;
    place-items: center;
    flex: 0 0 40px;
    height: 40px;
    border-radius: 11px;
    background: #eaf5f8;
    color: #234963;
    font-style: normal;
    font-size: 11px;
    font-weight: 800;
  }
  .chat span {
    min-width: 0;
  }
  .chat strong,
  .chat small,
  .chat em {
    display: block;
  }
  .chat strong {
    font-size: 10px;
  }
  .chat small {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #7d8d9c;
    font-size: 9px;
    margin: 5px 0;
  }
  .chat em {
    width: max-content;
    border-radius: 8px;
    padding: 3px 6px;
    background: #eaf9f1;
    color: #198d6c;
    font-size: 8px;
    font-style: normal;
    font-weight: 800;
  }
  .chat time {
    margin-left: auto;
    font-size: 8px;
    color: #8797a5;
  }
  .messages header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px;
    border-bottom: 1px solid #e5edf2;
  }
  .messages header strong {
    font-size: 11px;
  }
  .messages header small {
    display: block;
    color: #8493a1;
    font-size: 9px;
    margin-top: 5px;
    font-weight: 400;
  }
  .messages header button {
    margin-left: auto;
    border: 1px solid #d8e3ea;
    border-radius: 8px;
    background: #fff;
    padding: 8px;
    font-size: 9px;
  }
  .steps {
    padding: 14px;
    text-align: center;
    border-bottom: 1px solid #e8eef2;
    color: #168c68;
    font-size: 9px;
  }
  .bubble {
    max-width: 75%;
    margin: 18px 24px;
    padding: 13px;
    border-radius: 14px;
    font-size: 11px;
    line-height: 1.5;
  }
  .bubble small {
    display: block;
    text-align: right;
    color: #9ba8b3;
    font-size: 8px;
  }
  .bubble.ai {
    margin-left: auto;
    margin-right: 24px;
    background: #f4f0ff;
    border: 1px solid #ded0fb;
  }
  .bubble.ai strong {
    display: block;
    color: #7150aa;
    font-size: 9px;
    margin-bottom: 7px;
  }
  .contact {
    padding: 25px 20px;
    text-align: left;
  }
  .contact > i {
    margin: 0 auto 12px;
  }
  .contact h3 {
    text-align: center;
    font-size: 13px;
  }
  .contact > small {
    display: block;
    text-align: center;
  }
  .contact hr {
    border: 0;
    border-top: 1px solid #e2e9ee;
    margin: 22px 0;
  }
  .contact p {
    font-size: 9px;
    color: #75869a;
    border-bottom: 1px solid #edf1f4;
    padding-bottom: 10px;
  }
  .contact p b {
    float: right;
    color: #173957;
  }
  .date {
    margin-top: 14px;
    padding: 12px;
    border: 2px solid #1d9b72;
    border-radius: 10px;
    color: #173957;
    font-size: 11px;
  }
  .confirm {
    width: 100%;
    margin-top: 14px;
    padding: 13px;
    border: 0;
    border-radius: 9px;
    background: #327cbb;
    color: #fff;
    font-size: 10px;
    font-weight: 800;
  }
  @media (max-width: 1000px) {
    .chat-layout {
      grid-template-columns: 270px 1fr;
    }
    .contact {
      display: none;
    }
    .metrics {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 650px) {
    .heading {
      display: block;
    }
    .connected {
      display: inline-block;
      margin-bottom: 15px;
    }
    .switches {
      grid-template-columns: 1fr;
    }
    .flow {
      overflow: auto;
      justify-content: start;
      gap: 22px;
      min-width: 650px;
    }
    .metrics {
      grid-template-columns: 1fr 1fr;
    }
    .chat-layout {
      grid-template-columns: 1fr;
    }
    .messages {
      min-height: 560px;
    }
    .inbox {
      max-height: 420px;
      overflow: auto;
    }
  }
  .inbox h2 button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 35px;
    padding: 0;
    line-height: 1;
  }
  .waiting-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 150px;
    padding: 24px;
    text-align: center;
  }
  .waiting-state strong {
    color: #183b5d;
    font-size: 14px;
    line-height: 1.3;
  }
  .waiting-state small {
    max-width: 220px;
    margin-top: 9px;
    color: #8192a5;
    font-size: 10px;
    line-height: 1.6;
  }
</style>
