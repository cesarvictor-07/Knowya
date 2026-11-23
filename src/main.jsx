import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@fontsource/lemon";
import './styles/global.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado correctamente:', registration.scope);
      })
      .catch((error) => {
        console.error('Error al registrar el Service Worker:', error);
      });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
