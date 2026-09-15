import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global fetch base URL handler for mobile APK / Capacitor
if (typeof window !== 'undefined') {
  const getApiBaseUrl = () => {
    const proto = window.location.protocol;
    const host = window.location.hostname;
    if (proto === 'capacitor:' || proto === 'ionic:' || proto === 'file:' || (host === 'localhost' && window.location.port !== '3000')) {
      return 'https://ais-dev-7sswqit74jbp5atdcfnmni-106673320800.asia-southeast1.run.app';
    }
    return '';
  };
  (window as any).__API_BASE_URL__ = getApiBaseUrl();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

