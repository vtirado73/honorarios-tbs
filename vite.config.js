import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/honorarios-tbs/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'Horarios - Gestión Docente',
        short_name: 'Horarios',
        description: 'Sistema de gestión de horarios docentes y honorarios',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        scope: mode === 'production' ? '/honorarios-tbs/' : '/',
        start_url: mode === 'production' ? '/honorarios-tbs/' : '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: mode === 'production' ? '/honorarios-tbs/index.html' : '/index.html',
        navigateFallbackDenylist: [/^\/login$/],
      },
    }),
  ],
}))
