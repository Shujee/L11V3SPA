/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../stores'
import router from '../router'
import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(DataLoaderPlugin, { router })
    .use(router)
    .use(pinia)
}
