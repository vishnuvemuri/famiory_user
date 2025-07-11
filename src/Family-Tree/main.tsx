import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './AppFamily.tsx';
import './indexFamily.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
