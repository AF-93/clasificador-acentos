import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { logEnvironmentInfo, validateConfiguration } from './utils/debug.js'

// Inicializar logging y validación
logEnvironmentInfo();
validateConfiguration();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)