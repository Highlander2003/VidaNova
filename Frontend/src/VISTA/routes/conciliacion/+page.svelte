<script lang="ts">
  import AppFrame from "$vista/components/AppFrame.svelte";
  import { onMount } from "svelte";
  import { ConciliacionController } from "$controlador/conciliacion.svelte";
  import { conductLines, conductParts, contextParts } from "$modelo/conciliacion";

  const c = new ConciliacionController();

  onMount(() => {
    void c.checkBackend();
    void c.loadFolder();
  });
</script>

<svelte:head
  ><title>Conciliación evolución-órdenes | Vidanova</title></svelte:head
>

<AppFrame active="Conciliación" title="Conciliación evolución-órdenes">
  <div class="head">
    <div>
      <p class="eyebrow">CONCILIACIÓN EVOLUCIÓN-ÓRDENES</p>
      <h1>Detectar no equivale a ordenar</h1>
    </div>
    <div class="head-status">
      <span class:offline={!c.backendConnected} class="backend-status"
        >{c.backendConnected ? "Backend conectado" : "Backend no Conectado"}</span
      ><span class="human">✓ &nbsp; Validación humana obligatoria</span>
    </div>
  </div>

  <div class="workspace">
    {#if c.selectedHistory}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="modal-overlay" onclick={() => (c.selectedHistoryId = null)}>
        <div
          class="modal-content analysis"
          onclick={(e) => e.stopPropagation()}
        >
          <button
            class="modal-close"
            aria-label="Cerrar modal"
            onclick={() => (c.selectedHistoryId = null)}>×</button
          >
          <h2 class="modal-title">{c.selectedHistory.patientName}</h2>
          <div class="stats">
            <article>
              Coincidencias<strong>{c.matches.length}</strong><small
                >{c.matches.length
                  ? "Encontradas en Conducta a Seguir"
                  : "Sin palabras clave en Conducta a Seguir"}</small
              >
            </article>
            <article>
              Alerta principal<strong
                class:danger={c.matches[0]?.level === "ROJO"}
                >{c.matches[0]?.level ?? "NORMAL"}</strong
              ><small
                >{c.matches[0]
                  ? (c.matches[0].fraseClave ?? c.matches[0].phrase ?? "Sin frase")
                  : "Sin alertas"}</small
              >
            </article>
            <article>
              Historia analizada<strong>✓</strong><small
                >{c.selectedHistory.label} de {c.selectedDocument?.histories
                  .length}</small
              >
            </article>
          </div>
          <div class="conduct">
            <p class="eyebrow">CONTENIDO CLÍNICO ANALIZADO</p>
            <div class="conduct-copy">
              {#each conductLines(c.selectedHistory.conduct) as line}<p>
                  {#each conductParts(line, c.matches) as part}<span
                      class:rojo={part.level === "ROJO"}
                      class:ambar={part.level === "AMARILLO"}
                      class:verde={part.level === "VERDE"}>{part.text}</span
                    >{/each}
                </p>{/each}
            </div>
          </div>
          <div class="columns">
            <section class="results">
              <p class="eyebrow">RESULTADOS DEL ANÁLISIS</p>
              <h2>
                {c.matches.length
                  ? "Alertas y contextos encontrados"
                  : "Sin alertas detectadas"}
              </h2>
              {#each c.matches as match}<article
                  class:high={match.level === "ROJO"}
                  class:medium={match.level === "AMARILLO"}
                  class:low={match.level === "VERDE"}
                >
                  <div class="result-heading">
                    <span class="badge">{match.level}</span><strong
                      ><u
                        >{match.fraseClave ??
                          match.phrase ??
                          "Frase no disponible"}</u
                      ></strong
                    >
                  </div>
                  <p class="context-label">Contexto encontrado</p>
                  <p class="context">
                    “{#each contextParts(match, c.selectedHistory.conduct) as part}{#if part.highlighted}<mark
                          >{part.text}</mark
                        >{:else}{part.text}{/if}{/each}”
                  </p>
                </article>{/each}{#if !c.matches.length}<p class="empty">
                  La conducta fue leída, pero no contiene palabras clave de la
                  matriz actual.
                </p>{/if}
            </section>
            <aside class="explain">
              <p class="eyebrow">SIGUIENTE PASO</p>
              <h2>Revisión humana</h2>
              <p>
                Estas coincidencias son señales operativas, no diagnósticos ni
                órdenes médicas.
              </p>
              <div class="actions">
                <button
                  class="primary"
                  onclick={() => (c.decision = "confirmada")}
                  >Confirmar alerta</button
                ><button onclick={() => (c.decision = "descartada")}
                  >Descartar</button
                ><button onclick={() => (c.decision = "aclaracion")}
                  >Solicitar aclaración</button
                >
              </div>
              {#if c.decision}<small class="feedback"
                  >Decisión registrada: {c.decision}.</small
                >{/if}
            </aside>
          </div>
        </div>
      </div>
    {/if}
    <aside class="waiting">
      <div class="waiting-heading">
        <div>
          <p class="eyebrow">BANDEJA DE ESPERA</p>
          <h2>Pacientes próximos a analizar</h2>
        </div>
        <div class="waiting-tools">
          <span
            >{c.documents.reduce(
              (total, document) => total + document.histories.length,
              0,
            )}</span
          ><button
            class="dictionary-toggle"
            aria-expanded={c.dictionaryOpen}
            onclick={() => (c.dictionaryOpen = !c.dictionaryOpen)}
            title="Abrir diccionario de alertas">⌕</button
          >
        </div>
      </div>
      {#if c.dictionaryOpen}<section class="dictionary">
          <div class="dictionary-title">
            <div>
              <p class="eyebrow">DICCIONARIO DE ALERTAS</p>
              <h3>Palabras clave</h3>
            </div>
            <button
              class="dictionary-close"
              aria-label="Cerrar diccionario"
              onclick={() => (c.dictionaryOpen = false)}>×</button
            >
          </div>
          <form
            onsubmit={(event) => {
              event.preventDefault();
              c.saveEntry();
            }}
          >
            <input
              bind:value={c.draftPhrase}
              placeholder="Nueva palabra o frase"
              aria-label="Palabra clave"
            /><select bind:value={c.draftLevel} aria-label="Nivel de alerta"
              ><option value="ROJO">Rojo</option><option value="AMARILLO"
                >Ámbar</option
              ><option value="VERDE">Verde</option></select
            ><button class="save-entry" type="submit"
              >{c.editingEntryId === null ? "Agregar" : "Guardar"}</button
            >
          </form>
          <div class="dictionary-list">
            {#each c.dictionary as entry}<div class="dictionary-row">
                <span
                  class:rojo={entry.level === "ROJO"}
                  class:ambar={entry.level === "AMARILLO"}
                  class:verde={entry.level === "VERDE"}>{entry.phrase}</span
                >
                <div>
                  <button
                    aria-label={`Editar ${entry.phrase}`}
                    onclick={() => c.startEdit(entry)}>Editar</button
                  ><button
                    aria-label={`Eliminar ${entry.phrase}`}
                    onclick={() => c.deleteEntry(entry.id)}>Eliminar</button
                  >
                </div>
              </div>{/each}
          </div>
        </section>{/if}
      <p class="waiting-help">
        Pacientes encontrados dentro de cada historia clínica. El PDF de origen
        se conserva en Doc_PDF.
      </p>
      {#if c.documents.length === 0}<p class="waiting-empty">
          No hay pacientes pendientes.
        </p>{/if}{#each c.documents as document}<div class="document-group">
          <small class="source">PDF · {document.name}</small
          >{#if document.status === "procesando"}<p class="processing">
              Leyendo historias...
            </p>{:else if document.status === "error"}<p class="error">
              {document.error}
            </p>{:else}{#each document.histories as history}<button
                class:active={history.id === c.selectedHistoryId}
                class="document"
                onclick={() => {
                  c.selectedDocumentId = document.id;
                  c.selectedHistoryId = history.id;
                  c.decision = "";
                }}
                ><span class="patient-icon"
                  >{history.patientName.slice(0, 2).toUpperCase()}</span
                ><span
                  ><strong>{history.patientName}</strong><small
                    >{history.label} · {history.matches.length} alertas</small
                  ></span
                ><b>›</b></button
              >{/each}{/if}
        </div>{/each}
    </aside>
  </div>
</AppFrame>

<style>
  .head {
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
  .human {
    padding: 12px 15px;
    border: 1px solid #bfe8d4;
    border-radius: 9px;
    color: #198d6c;
    background: #ebfaf3;
    font-size: 10px;
    font-weight: 800;
  }
  .workspace {
    display: flex;
    flex-direction: column;
    gap: 18px;
    align-items: stretch;
  }
  .analysis {
    min-width: 0;
    width: 100%;
  }
  .error {
    color: #ce4058;
    font-size: 10px;
  }
  .waiting {
    order: -1;
    border: 1px solid #dce6ed;
    border-radius: 14px;
    background: #fff;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
  }
  .waiting-heading {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: start;
  }
  .waiting-heading h2 {
    font-size: 17px;
  }
  .waiting-heading > span {
    display: grid;
    place-items: center;
    min-width: 25px;
    height: 25px;
    border-radius: 8px;
    background: #eaf5f8;
    color: #187b98;
    font-size: 11px;
    font-weight: 800;
  }
  .waiting-help {
    color: #8192a5;
    font-size: 10px;
    line-height: 1.5;
  }
  .waiting-empty {
    padding: 18px 0;
    color: #8192a5;
    font-size: 10px;
    text-align: center;
  }
  .document-group {
    margin-top: 15px;
  }
  .source {
    display: block;
    margin-bottom: 2px;
    color: #8a99a8;
    font-size: 8px;
    font-weight: 800;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .processing {
    padding: 10px 0;
    color: #c8751d;
    font-size: 9px;
  }
  .document {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 11px 0;
    border: 0;
    border-top: 1px solid #edf1f4;
    background: #fff;
    text-align: left;
  }
  .document.active {
    padding: 11px 8px;
    border-radius: 8px;
    background: #effafb;
  }
  .patient-icon {
    display: grid;
    place-items: center;
    flex: 0 0 31px;
    height: 31px;
    border-radius: 7px;
    background: #eaf5f8;
    color: #187b98;
    font-size: 8px;
    font-weight: 800;
  }
  .document > span:nth-child(2) {
    min-width: 0;
  }
  .document strong,
  .document small {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .document strong {
    color: #244663;
    font-size: 9px;
  }
  .document small {
    margin-top: 4px;
    color: #8493a1;
    font-size: 8px;
  }
  .document > b {
    margin-left: auto;
    color: #188c6b;
    font-size: 13px;
    white-space: nowrap;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 18px;
  }
  .stats article,
  .results,
  .explain,
  .empty-state {
    border: 1px solid #dce6ed;
    border-radius: 14px;
    background: #fff;
  }
  .stats article {
    padding: 20px;
    color: #748599;
    font-size: 10px;
  }
  .stats strong {
    display: block;
    margin: 9px 0 5px;
    color: #173654;
    font-size: 28px;
  }
  .stats strong.danger {
    color: #ce4058;
  }
  .stats small {
    font-size: 9px;
  }
  .columns {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: 18px;
  }
  .results {
    padding: 21px;
  }
  .results h2,
  .explain h2,
  .empty-state h2 {
    font-size: 19px;
  }
  .results article {
    margin-top: 14px;
    padding: 13px;
    border: 1px solid #c6eadc;
    border-radius: 9px;
    background: #eaf9f3;
  }
  .results article.medium {
    border-color: #f1d2ad;
    background: #fff6ea;
  }
  .results article.high {
    border-color: #f1cbd2;
    background: #fff0f2;
  }
  .badge {
    display: inline-block;
    margin-right: 9px;
    color: #188c6b;
    font-size: 9px;
    font-weight: 800;
  }
  .medium .badge {
    color: #c8751d;
  }
  .high .badge {
    color: #ce4058;
  }
  .results article strong {
    font-size: 11px;
  }
  .results article p {
    margin: 8px 0 0;
    color: #627889;
    font-size: 10px;
    line-height: 1.5;
  }
  .explain {
    padding: 22px;
  }
  .explain > p:not(.eyebrow) {
    color: #748599;
    font-size: 11px;
    line-height: 1.6;
  }
  .actions {
    display: grid;
    gap: 9px;
    margin-top: 20px;
  }
  .actions button {
    padding: 11px;
    border: 1px solid #d8e3eb;
    border-radius: 8px;
    background: #fff;
    color: #244663;
    font-size: 10px;
    font-weight: 800;
  }
  .actions .primary {
    border-color: #327cbb;
    background: #327cbb;
    color: #fff;
  }
  .feedback {
    display: block;
    margin-top: 15px;
    color: #168b6b;
    font-size: 10px;
  }
  .empty-state {
    padding: 30px;
    text-align: center;
  }
  .empty-state p:not(.eyebrow),
  .empty {
    color: #8192a5;
    font-size: 11px;
  }
  @media (max-width: 800px) {
    .head {
      display: block;
    }
    .human {
      display: inline-block;
      margin-bottom: 15px;
    }
    .stats {
      grid-template-columns: 1fr;
    }
    .columns {
      grid-template-columns: 1fr;
    }
  }
  .conduct {
    margin-bottom: 18px;
    padding: 21px;
    border: 1px solid #dce6ed;
    border-left: 3px solid #3183c7;
    border-radius: 12px;
    background: #f7fafc;
  }
  .conduct-copy p {
    margin: 0 0 9px;
    color: #56687a;
    font-size: 11px;
    line-height: 1.7;
  }
  .conduct-copy p:last-child {
    margin-bottom: 0;
  }
  .conduct-copy span {
    padding: 1px 3px;
    border-radius: 3px;
    font-weight: 700;
  }
  .conduct-copy span.rojo {
    background: #ffd2d8;
    color: #b52e47;
  }
  .conduct-copy span.ambar {
    background: #ffe4b8;
    color: #a95c10;
  }
  .conduct-copy span.verde {
    background: #ccefe3;
    color: #167456;
  }
  .result-heading {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .result-heading strong {
    color: #173957;
  }
  .context-label {
    margin: 12px 0 5px !important;
    color: #8192a5 !important;
    font-size: 9px !important;
    font-weight: 800;
  }
  .results article .context {
    margin: 0;
    color: #56687a;
    font-size: 11px;
    line-height: 1.7;
  }
  .context mark {
    padding: 2px 4px;
    border-radius: 3px;
    background: #ffdf92;
    color: #463514;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
  }
  .results article.high .context mark {
    background: #ffd2d8;
  }
  .results article.medium .context mark {
    background: #ffe4b8;
  }
  .results article.low .context mark {
    background: #ccefe3;
  }
  .waiting-tools {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .dictionary-toggle {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border: 1px solid #bfe8d4;
    border-radius: 8px;
    background: #effaf5;
    color: #188c6b;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
  }
  .dictionary {
    margin: 16px 0;
    padding: 15px;
    border: 1px solid #cfe3e7;
    border-radius: 11px;
    background: #f8fcfc;
  }
  .dictionary-title {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 10px;
  }
  .dictionary h3 {
    margin: 0;
    color: #173957;
    font-size: 14px;
  }
  .dictionary-close {
    border: 0;
    background: transparent;
    color: #8192a5;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
  }
  .dictionary form {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 92px;
    gap: 7px;
    margin: 14px 0;
  }
  .dictionary input,
  .dictionary select {
    min-width: 0;
    padding: 8px;
    border: 1px solid #d5e3e8;
    border-radius: 7px;
    background: #fff;
    color: #244663;
    font-size: 9px;
  }
  .dictionary input {
    grid-column: 1 / -1;
  }
  .save-entry {
    grid-column: 1 / -1;
    padding: 8px;
    border: 0;
    border-radius: 7px;
    background: #327cbb;
    color: #fff;
    font-size: 9px;
    font-weight: 800;
    cursor: pointer;
  }
  .dictionary-list {
    display: grid;
    gap: 6px;
    max-height: 260px;
    overflow-y: auto;
  }
  .dictionary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 7px 0;
    border-top: 1px solid #e5eef0;
    color: #56687a;
    font-size: 9px;
  }
  .dictionary-row > span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dictionary-row > span.rojo {
    color: #b52e47;
  }
  .dictionary-row > span.ambar {
    color: #a95c10;
  }
  .dictionary-row > span.verde {
    color: #167456;
  }
  .dictionary-row div {
    display: flex;
    flex: 0 0 auto;
    gap: 4px;
  }
  .dictionary-row button {
    padding: 4px 5px;
    border: 1px solid #d7e3e8;
    border-radius: 5px;
    background: #fff;
    color: #527087;
    font-size: 8px;
    cursor: pointer;
  }
  .head-status {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .backend-status {
    padding: 10px 12px;
    border: 1px solid #bfe8d4;
    border-radius: 9px;
    color: #198d6c;
    background: #ebfaf3;
    font-size: 10px;
    font-weight: 800;
  }
  .backend-status.offline {
    border-color: #f1cbd2;
    color: #ce4058;
    background: #fff0f2;
  }
  .waiting {
    box-shadow: 0 12px 30px rgba(16, 45, 80, 0.06);
  }
  .waiting-heading {
    padding-bottom: 15px;
    border-bottom: 1px solid #edf2f5;
  }
  .waiting-heading h2 {
    max-width: 210px;
    line-height: 1.25;
    color: #173957;
  }
  .dictionary-toggle {
    font-weight: 800;
    letter-spacing: -0.5px;
    transition:
      background 0.18s ease,
      color 0.18s ease,
      transform 0.18s ease;
  }
  .dictionary-toggle:hover {
    background: #d9f4f0;
    color: #056b77;
    transform: translateY(-1px);
  }
  .dictionary {
    box-shadow: inset 0 2px 0 #1aa5a3;
  }
  .dictionary-title {
    padding-bottom: 12px;
    border-bottom: 1px solid #e3eeee;
  }
  .dictionary-title h3 {
    margin-top: 2px;
    font-size: 17px;
  }
  .dictionary-title .eyebrow {
    margin-bottom: 7px;
  }
  .dictionary-close {
    width: 26px;
    height: 26px;
    border-radius: 7px;
  }
  .dictionary-close:hover {
    background: #eaf3f4;
    color: #176b78;
  }
  .dictionary form {
    padding: 13px 0 15px;
    margin: 0;
    border-bottom: 1px solid #e3eeee;
  }
  .dictionary input,
  .dictionary select {
    height: 38px;
  }
  .dictionary input:focus,
  .dictionary select:focus {
    border-color: #25a4a7;
    box-shadow: 0 0 0 3px rgba(37, 164, 167, 0.12);
    outline: 0;
  }
  .save-entry {
    height: 38px;
    background: #168ca8;
    transition:
      background 0.18s ease,
      transform 0.18s ease;
  }
  .save-entry:hover {
    background: #0f718a;
    transform: translateY(-1px);
  }
  .dictionary-list {
    gap: 0;
    margin-top: 4px;
  }
  .dictionary-row {
    min-height: 39px;
    border-top: 0;
    border-bottom: 1px solid #e7eff0;
  }
  .dictionary-row:last-child {
    border-bottom: 0;
  }
  .dictionary-row > span {
    padding: 5px 7px;
    border-radius: 6px;
    font-weight: 700;
    background: #f1f7f7;
  }
  .dictionary-row > span.rojo {
    background: #fff0f2;
  }
  .dictionary-row > span.ambar {
    background: #fff5e8;
  }
  .dictionary-row > span.verde {
    background: #eaf8f2;
  }
  .dictionary-row button:hover {
    border-color: #8cc8cb;
    background: #effafa;
    color: #087c8d;
  }
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(16, 45, 80, 0.4);
    display: grid;
    place-items: center;
    z-index: 100;
    padding: 20px;
  }
  .modal-content {
    position: relative;
    background: #fff;
    border-radius: 14px;
    padding: 30px;
    max-width: 1300px;
    width: 95%;
    box-shadow: 0 12px 30px rgba(16, 45, 80, 0.1);
    max-height: 90vh;
    overflow-y: auto;
  }
  .modal-title {
    font-size: 24px;
    color: #0d294c;
    margin-bottom: 20px;
    padding-right: 40px;
  }
  .modal-close {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 32px;
    height: 32px;
    border: 0;
    background: #f1f5f8;
    color: #56687a;
    border-radius: 8px;
    font-size: 20px;
    cursor: pointer;
    display: grid;
    place-items: center;
    line-height: 1;
    z-index: 10;
  }
  .modal-close:hover {
    background: #e2eaf0;
    color: #173957;
  }
</style>
