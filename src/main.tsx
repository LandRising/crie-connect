
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Register Service Worker for PWA - usando workbox para melhor controle
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration.scope);
      })
      .catch((error) => {
        console.log('Falha ao registrar o Service Worker:', error);
      });
  });
}

// Adicionar listener para debugar o PWA
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt foi disparado');
  // Prevenir o comportamento padrão do Chrome
  e.preventDefault();
});

createRoot(document.getElementById("root")!).render(<App />);
