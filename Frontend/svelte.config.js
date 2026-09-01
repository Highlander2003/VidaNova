import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    // Organización MVC: las páginas (Vistas) viven en VISTA/routes,
    // los datos y el acceso a APIs en MODELO, y el estado de pantalla en CONTROLADOR.
    files: {
      lib: 'src/MODELO',
      routes: 'src/VISTA/routes',
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
