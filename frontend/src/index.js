// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './global.css';  // This imports the global styles
//import './index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error("No root element found");
}
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
