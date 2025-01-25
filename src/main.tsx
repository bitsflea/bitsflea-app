import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { HeliaProvider } from './context/HeliaContext';
import { LoadingProvider } from './context/LoadingContext';
import { ToastProvider } from './context/ToastContext';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  < ToastProvider >
    <LoadingProvider>
      <HeliaProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HeliaProvider>
    </LoadingProvider>
  </ToastProvider>
  // </StrictMode>
);