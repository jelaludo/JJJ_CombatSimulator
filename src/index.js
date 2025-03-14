import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import JJJCombat from './JJJCombat';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <JJJCombat />
    <Analytics />
  </React.StrictMode>
); 