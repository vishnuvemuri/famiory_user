// src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppPlanning from './AppPlanning';

import './index.css';
import '@fontsource/inter';
import '@fontsource/playfair-display';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppPlanning />
    </BrowserRouter>
  </StrictMode>
);