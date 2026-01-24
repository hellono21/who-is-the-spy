import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // This must match your repository name for GitHub Pages
  base: '/who-is-the-spy/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: '我是卧底 (Who is the Spy)',
        short_name: '我是卧底',
        description: '一个现代化的、完全离线的“我是卧底”聚会游戏应用。',
        theme_color: '#121212',
        background_color: '#121212',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        id: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            // Cache Tailwind CDN for offline usage
            urlPattern: /^https:\/\/cdn\.tailwindcss\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tailwind-cdn',
              cacheableResponse: {
                statuses: [0, 200]
              },
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.loli\.net/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'font-stylesheets',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/gstatic\.loli\.net/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-webfonts',
              cacheableResponse: {
                statuses: [0, 200]
              },
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ]
      }
    })
  ]
})