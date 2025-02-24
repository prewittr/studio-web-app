// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global.css';  // This imports the global styles
//import './index.css';
import { AuthProvider } from './components/AuthContext'; // Import AuthProvider
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root');
if (!container) {
  throw new Error("No root element found");
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);
