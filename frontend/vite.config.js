import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
  // 👇 Hook para injetar o Google Analytics automaticamente no <head>
  transformIndexHtml: {
    enforce: 'pre',
    transform(html) {
      const gaTag = `
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FVQE8RRT75"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FVQE8RRT75');
        </script>
      `;
      return html.replace('</head>', `${gaTag}\n</head>`);
    },
  },
});
