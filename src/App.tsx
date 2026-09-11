import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ResetPassword from './pages/ResetPassword';

import TotpLoginGate from './components/TotpLoginGate';

function InnerApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/termos" element={<Terms />} />
        <Route path="/privacidade" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <TotpLoginGate systemName="Vorcon Router" systemId="VORCON_ROUTER_LANDING" totpSecret="NPV7HKK23HQ2OERKXVNDMCNESA2E4JZA" backupCodes={['911247','697257','661017','293549']}>
      <InnerApp />
    </TotpLoginGate>
  );
}

export default App;
