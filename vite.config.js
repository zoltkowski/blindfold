import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: [{ find: /^onnxruntime-web$/, replacement: 'onnxruntime-web/wasm' }]
  },
  worker: { format: 'es' },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        voiceTest: resolve(__dirname, 'voice-test.html')
      }
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico'],
      workbox: {
        globIgnores: ['**/engines/**', '**/ort-wasm-*.wasm']
      },
      manifest: {
        name: 'Blindfold Chess Trainer',
        short_name: 'BlindfoldChess',
        description: 'Blindfold chess training with voice, puzzles, and drills.',
        theme_color: '#141516',
        background_color: '#141516',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});
