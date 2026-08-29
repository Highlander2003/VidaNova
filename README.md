# Vidanova Navigator

Monorepo de la plataforma de navegación oncológica y gestión de casos.

- `Frontend/`: aplicación SvelteKit para la interfaz.
- `Backend/`: aplicación SvelteKit API-only. No contiene páginas de usuario.

## Requisitos

- Node.js 24 o superior.
- Corepack, incluido con Node.js.
- PostgreSQL y Redis serán necesarios cuando se activen la base de datos y las colas.

## Instalación

Desde la raíz del repositorio:

```powershell
corepack pnpm install
```

Si prefieres habilitar `pnpm` como comando global para esta sesión de Node:

```powershell
corepack enable
pnpm install
```

## Variables de entorno

Crea los archivos locales a partir de los ejemplos:

```powershell
Copy-Item Frontend/.env.example Frontend/.env
Copy-Item Backend/.env.example Backend/.env
```

`Frontend/.env` contiene `PUBLIC_API_URL`, que debe apuntar al Backend. Las credenciales sensibles (`DATABASE_URL`, `META_WHATSAPP_TOKEN` y `JWT_SECRET`) pertenecen únicamente a `Backend/.env` y nunca deben copiarse al Frontend.

Para el entorno local, el contenido mínimo de `Frontend/.env` es:

```env
PUBLIC_API_URL=http://localhost:3001
```

## Ejecución en desarrollo

Abre dos terminales ubicadas en la raíz.

### Backend

```powershell
corepack pnpm --dir Backend dev --port 3001
```

El endpoint de comprobación queda disponible en:

```text
http://localhost:3001/api/health
```

Debe responder:

```json
{"status":"ok"}
```

### Frontend

En la segunda terminal:

```powershell
corepack pnpm --dir Frontend dev --port 3000
```

Abre <http://localhost:3000> en el navegador.

### Si aparece "Backend no Conectado"

El Frontend puede mostrar sus páginas aunque el Backend esté detenido, porque la interfaz se sirve de forma independiente. Sin embargo, las funciones dinámicas, como el análisis de PDFs y las conversaciones de WhatsApp, necesitan el Backend.

Comprueba que el Backend responda:

```powershell
Invoke-WebRequest http://localhost:3001/api/health
```

Si responde `{"status":"ok"}`, verifica que `Frontend/.env` use el mismo puerto y reinicia el servidor del Frontend para que Vite vuelva a cargar las variables de entorno.

## Comprobaciones y build

Ejecutar el chequeo de tipos en ambos paquetes:

```powershell
corepack pnpm check
```

Generar la compilación de producción:

```powershell
corepack pnpm build
```

Previsualizar una compilación concreta dentro de cada paquete:

```powershell
corepack pnpm --dir Frontend preview --port 4173
corepack pnpm --dir Backend preview --port 4174
```

Abre el Frontend en <http://localhost:4173>. El Backend es una API y se puede comprobar en <http://localhost:4174/> o en <http://localhost:4174/api/health>; no ofrece una página visual.

## Estructura

```text
Frontend/
  src/routes/       Páginas y layouts de la interfaz
  src/lib/api/       Clientes HTTP tipados del Backend
  src/lib/components/ Componentes compartidos
  src/stores/        Estado del cliente

Backend/
  src/routes/api/   Endpoints HTTP
  src/lib/server/   Lógica de negocio, autenticación, DB y servicios
```

La comunicación entre aplicaciones se realiza mediante HTTP. El Frontend no accede directamente a PostgreSQL ni a Meta Cloud API.
