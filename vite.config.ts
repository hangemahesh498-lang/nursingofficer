import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function suppressViteHmrLogsPlugin(): Plugin {
  const scriptContent = `(function () {
  const methods = ['error', 'warn', 'log', 'info', 'debug'];
  const isViteMessage = (args) => {
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (typeof a === 'string') {
        if (a.includes('[vite]') || a.includes('vite:') || a.includes('websocket') || a.includes('WebSocket')) {
          return true;
        }
      } else if (a && typeof a === 'object') {
        const msg = a.message || a.reason || '';
        if (typeof msg === 'string' && (msg.includes('[vite]') || msg.includes('websocket') || msg.includes('WebSocket'))) {
          return true;
        }
      }
    }
    return false;
  };

  methods.forEach((m) => {
    const orig = console[m];
    if (typeof orig === 'function') {
      console[m] = function (...args) {
        if (isViteMessage(args)) return;
        return orig.apply(console, args);
      };
    }
  });

  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (e) => {
      const reason = String(e.reason?.message || e.reason || '');
      if (reason.includes('[vite]') || reason.includes('websocket') || reason.includes('WebSocket')) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);

    window.addEventListener('error', (e) => {
      const msg = String(e.message || '');
      if (msg.includes('[vite]') || msg.includes('websocket') || msg.includes('WebSocket')) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);

    const OrigWebSocket = window.WebSocket;
    if (typeof OrigWebSocket === 'function') {
      const FakeWebSocket = function (url, protocols) {
        const isViteHmr =
          protocols === 'vite-hmr' ||
          (Array.isArray(protocols) && protocols.includes('vite-hmr')) ||
          (typeof url === 'string' && (url.includes('token=') || url.includes('vite-hmr')));

        if (isViteHmr) {
          const fakeWs = new EventTarget();
          fakeWs.CONNECTING = 0;
          fakeWs.OPEN = 1;
          fakeWs.CLOSING = 2;
          fakeWs.CLOSED = 3;
          fakeWs.readyState = 1;
          fakeWs.url = String(url);
          fakeWs.protocol = 'vite-hmr';
          fakeWs.send = function () {};
          fakeWs.close = function () {
            fakeWs.readyState = 3;
            fakeWs.dispatchEvent(new Event('close'));
          };
          setTimeout(() => {
            fakeWs.dispatchEvent(new Event('open'));
          }, 0);
          return fakeWs;
        }

        return new OrigWebSocket(url, protocols);
      };
      FakeWebSocket.CONNECTING = 0;
      FakeWebSocket.OPEN = 1;
      FakeWebSocket.CLOSING = 2;
      FakeWebSocket.CLOSED = 3;
      FakeWebSocket.prototype = OrigWebSocket.prototype;
      window.WebSocket = FakeWebSocket;
    }
  }
})();`;

  return {
    name: 'suppress-vite-hmr-logs',
    transformIndexHtml: {
      order: 'pre',
      handler() {
        return [
          {
            tag: 'script',
            children: scriptContent,
            injectTo: 'head-prepend',
          },
        ];
      },
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      suppressViteHmrLogsPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          maximumFileSizeToCacheInBytes: 5000000,
        },
        includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'icon.svg', 'pwa-192x192.png', 'pwa-512x512.png', 'manifest.json'],
        manifest: {
          id: '/',
          name: 'Nursing Officer Exam Preparation Platform',
          short_name: 'NursingPrep',
          description: 'Comprehensive, bilingual (English & Marathi) Nursing Officer exam preparation app with real practice engines, mock tests, clinical case studies, smart weakness analysis, AI Study Coach, and admin CMS.',
          theme_color: '#0f766e',
          background_color: '#f8fafc',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            }
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
