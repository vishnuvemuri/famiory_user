import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './AppForever.tsx';
import './indexForever.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
