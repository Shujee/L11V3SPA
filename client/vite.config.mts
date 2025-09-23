// Plugins
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Fonts from 'unplugin-fonts/vite'
import Layouts from 'vite-plugin-vue-layouts'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import mkcert from 'vite-plugin-mkcert'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { visualizer } from 'rollup-plugin-visualizer'
import dns from 'dns'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mkcert({
      hosts: ['((server_name))'],
    }),
    VueRouter({
      dts: 'src/typed-router.d.ts',
    }),
    Layouts(),
    AutoImport({
      imports: [
        'vue',
        {
          'vue-router/auto': ['useRoute', 'useRouter'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: true, // automatically open in browser
      gzipSize: true,
      brotliSize: true,
    }),
    Components({
      dts: 'src/components.d.ts',
      dirs: [
        'src/components', // default
        'src/modals', // ✅ modal components
      ],
      resolvers: [
        IconsResolver({
          prefix: 'Icon', // Optional: allows `<IconMdiAccountBox />` usage
        }),
      ],
    }),
    Icons({
      scale: 1.6, // Scale of icons against 1em
      defaultStyle: '', // Style apply to icons
      defaultClass: '', // Class names apply to icons
      compiler: 'vue3', // 'vue2', 'vue3', 'jsx'
      autoInstall: true,
    }),
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Fonts({
      google: {
        families: [{
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        }],
      },
    }),
    viteStaticCopy({
      targets: [
        {
          src: '../server/public/index.html',
          dest: '../resources/views/',
          rename: 'welcome.blade.php',
        },
      ],
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  build: {
    outDir: '../server/public',
    emptyOutDir: true,
  },
  server: {
    port: ((client_port)),
    host: true,
    hmr: {
      host: '((server_name))', // 👈 must match your browser URL
      protocol: 'wss',
      port: ((client_port))
    }
  },
})
