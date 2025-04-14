
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Register Service Worker for PWA - using workbox for better control
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.log('Failed to register Service Worker:', error);
      });
  });
}

// Add listener to debug PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt event fired!');
  // Store the event for later use instead of preventing default
  window.deferredPrompt = e;
});

createRoot(document.getElementById("root")!).render(<App />);
