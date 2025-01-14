import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { HeliaProvider } from './context/HeliaContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeliaProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HeliaProvider>

  </StrictMode>
);