import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

// HTML raiz (usado na saída estática). Aqui entram manifesto, cor do tema e service worker.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Usuários" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <ScrollViewStyleReset />
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function (e) { console.warn('SW:', e); });
  });
}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
