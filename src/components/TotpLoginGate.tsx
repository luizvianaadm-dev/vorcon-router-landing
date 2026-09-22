import React, { useState, useEffect, useRef } from 'react';

interface TotpLoginGateProps {
  systemName: string;
  systemId: string;
  totpSecret: string;
  backupCodes: string[];
  children: React.ReactNode;
  storageKey?: string;
}

// Minimal TOTP validator (RFC 6238) - client-side pre-check
function base32ToBytes(base32: string): Uint8Array {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (const c of base32.toUpperCase()) {
    const val = chars.indexOf(c);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.substring(i * 8, i * 8 + 8), 2);
  }
  return bytes;
}

async function hmacSha1(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey('raw', key as unknown as BufferSource, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, data as unknown as BufferSource);
  return new Uint8Array(sig);
}


export function TotpLoginGate({ systemName, systemId, totpSecret, backupCodes, children, storageKey }: TotpLoginGateProps) {
  const sKey = storageKey || '@vorcon_' + systemId.toLowerCase() + '_authenticated';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if already authenticated in this session
    const session = sessionStorage.getItem(sKey);
    if (session) {
      try {
        const data = JSON.parse(session);
        const now = Date.now();
        // Session valid for 8 hours
        if (data.ts && (now - data.ts) < 8 * 60 * 60 * 1000) {
          setIsAuthenticated(true);
          return;
        }
      } catch {}
    }
    setIsAuthenticated(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [sKey]);

  const handleVerify = async () => {
    if (code.length !== 6) { setError('Digite os 6 digitos.'); return; }
    setLoading(true);
    setError('');
    try {
      // Check backup codes first
      if (backupCodes.includes(code)) {
        sessionStorage.setItem(sKey, JSON.stringify({ ts: Date.now(), method: 'backup' }));
        setIsAuthenticated(true);
        return;
      }
      // Verify TOTP with 1-window tolerance (current + prev + next)
      for (const offset of [0, -1, 1]) {
        const epoch = Math.floor(Date.now() / 1000) + (offset * 30);
        const key = base32ToBytes(totpSecret);
        const counter = Math.floor(epoch / 30);
        const data = new Uint8Array(8);
        let tmp = counter;
        for (let i = 7; i >= 0; i--) { data[i] = tmp & 0xff; tmp = Math.floor(tmp / 256); }
        const hash = await hmacSha1(key, data);
        const off = hash[hash.length - 1] & 0x0f;
        const otp = ((hash[off] & 0x7f) << 24 | (hash[off + 1] & 0xff) << 16 | (hash[off + 2] & 0xff) << 8 | (hash[off + 3] & 0xff)) % 1000000;
        const expected = otp.toString().padStart(6, '0');
        if (code === expected) {
          sessionStorage.setItem(sKey, JSON.stringify({ ts: Date.now(), method: 'totp' }));
          setIsAuthenticated(true);
          return;
        }
      }
      setError('Codigo invalido. Tente novamente.');
    } catch (e) {
      setError('Erro na verificacao.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleVerify();
  };

  if (isAuthenticated) return <>{children}</>;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 99999, fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: '16px', padding: '48px 40px', maxWidth: '420px', width: '90%',
        boxShadow: '0 0 60px rgba(6, 182, 212, 0.15), 0 25px 50px rgba(0,0,0,0.5)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
        <h1 style={{ color: '#e2e8f0', fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>
          AURA SENTINEL
        </h1>
        <p style={{ color: '#06b6d4', fontSize: '14px', fontWeight: 600, margin: '0 0 8px' }}>
          {systemName}
        </p>
        <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 32px' }}>
          Acesso protegido por autenticacao TOTP.
          Digite o codigo de 6 digitos do Google Authenticator.
        </p>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
          onKeyDown={handleKeyDown}
          placeholder="000000"
          autoComplete="one-time-code"
          style={{
            width: '100%', boxSizing: 'border-box', padding: '16px',
            fontSize: '32px', fontWeight: 700, textAlign: 'center', letterSpacing: '12px',
            background: 'rgba(30, 41, 59, 0.8)', border: error ? '2px solid #ef4444' : '2px solid rgba(6, 182, 212, 0.4)',
            borderRadius: '12px', color: '#e2e8f0', outline: 'none',
            transition: 'border-color 0.2s'
          }}
        />
        {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: '8px 0 0' }}>{error}</p>}
        <button
          onClick={handleVerify}
          disabled={loading || code.length !== 6}
          style={{
            width: '100%', padding: '14px', marginTop: '20px',
            background: code.length === 6 ? 'linear-gradient(135deg, #0891b2, #06b6d4)' : 'rgba(51, 65, 85, 0.5)',
            border: 'none', borderRadius: '12px', color: '#fff',
            fontSize: '15px', fontWeight: 700, cursor: code.length === 6 ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s', letterSpacing: '1px'
          }}
        >
          {loading ? 'Verificando...' : 'DESBLOQUEAR ACESSO'}
        </button>
        <button
          onClick={() => setShowBackup(!showBackup)}
          style={{
            background: 'none', border: 'none', color: '#64748b',
            fontSize: '12px', marginTop: '16px', cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {showBackup ? 'Ocultar' : 'Usar codigo de emergencia'}
        </button>
        {showBackup && (
          <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '8px' }}>
            Digite um dos seus codigos de backup de 6 digitos no campo acima.
          </p>
        )}
        <div style={{ marginTop: '32px', borderTop: '1px solid rgba(100,116,139,0.2)', paddingTop: '16px' }}>
          <p style={{ color: '#475569', fontSize: '10px', margin: 0, lineHeight: 1.5 }}>
            VORCON AIO LTDA · CNPJ 66.622.728/0001-63<br/>
            Protegido por AURA SENTINEL Q-Shield v3.0<br/>
            Art. 154-A do Codigo Penal Brasileiro
          </p>
        </div>
      </div>
    </div>
  );
}

export default TotpLoginGate;
