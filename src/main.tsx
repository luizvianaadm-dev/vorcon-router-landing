import { initAuraSentinelSDK } from './lib/aura-sentinel-sdk';
initAuraSentinelSDK({
  systemId: 'VORCON_WAROUTER',
  systemName: 'Vorcon WhatsApp Router',
  adminStorageKey: '@vorcon_warouter_admin',
  mfaStorageKey: '@vorcon_warouter_mfa',
  tokenStorageKey: '@vorcon_warouter_token',
  restrictedPaths: ['/admin', '/dashboard'],
  enablePWABlock: true,
});

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

