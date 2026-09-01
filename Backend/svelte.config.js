import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    // Organización MVC: SvelteKit busca rutas, librería y plantilla en estas carpetas.
    files: {
      lib: 'src/MODELO',
      routes: 'src/CONTROLADOR/routes',
      appTemplate: 'src/VISTA/app.html',
      assets: 'src/VISTA/static'
    },
    alias: {
      $modelo: 'src/MODELO',
      $controlador: 'src/CONTROLADOR',
      $vista: 'src/VISTA'
    }
  }
};

export default config;
