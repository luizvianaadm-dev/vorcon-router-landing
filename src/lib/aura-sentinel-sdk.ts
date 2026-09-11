/**
 * AURA SENTINEL SDK v3.0 — Módulo de Segurança Compartilhado
 * Grupo VORCON - Fundador: Luiz Carlos Lopes Viana
 */

export interface SentinelSDKConfig {
  systemId: string;
  systemName: string;
  adminStorageKey: string;
  mfaStorageKey: string;
  tokenStorageKey: string;
  restrictedPaths?: string[];
  enablePWABlock?: boolean;
}

function isTokenValid(config: SentinelSDKConfig): boolean {
  try {
    const token = localStorage.getItem(config.tokenStorageKey);
    if (!token || !token.startsWith('asst_v2.')) return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) { clearSession(config); return false; }
    return true;
  } catch { return false; }
}

function clearSession(config: SentinelSDKConfig): void {
  localStorage.removeItem(config.adminStorageKey);
  localStorage.removeItem(config.mfaStorageKey);
  localStorage.removeItem(config.tokenStorageKey);
}

function getSessionToken(config: SentinelSDKConfig): string | null {
  if (!isTokenValid(config)) return null;
  return localStorage.getItem(config.tokenStorageKey);
}

function initAntiDevToolsShield(config: SentinelSDKConfig): void {
  console.log(
    '%c\uD83D\uDEE1\uFE0F AURA SENTINEL Q-SHIELD v3.0 — ' + config.systemName + ' %c\nSISTEMA ZERO-TRUST ATIVO\n\nTentativas de varredura ou engenharia reversa sao interceptadas e reportadas ao SIEM soberano VORCON.\n\nArt. 154-A e 313-A do Codigo Penal Brasileiro.',
    'background: #0284c7; color: white; font-size: 14px; font-weight: bold; padding: 4px 10px; border-radius: 4px;',
    'color: #94a3b8; font-size: 11px;'
  );

  window.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault(); e.stopPropagation();
      console.warn('[AURA SENTINEL — ' + config.systemId + '] F12 bloqueado.');
      window.dispatchEvent(new CustomEvent('vorcon:sentinel-alert', { detail: { type: 'devtools', system: config.systemId } }));
      return false;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I','i','J','j','C','c'].indexOf(e.key) !== -1) {
      e.preventDefault(); e.stopPropagation();
      window.dispatchEvent(new CustomEvent('vorcon:sentinel-alert', { detail: { type: 'devtools', system: config.systemId } }));
      return false;
    }
    if ((e.ctrlKey || e.metaKey) && ['U','u','S','s'].indexOf(e.key) !== -1) {
      e.preventDefault(); e.stopPropagation(); return false;
    }
  });

  window.addEventListener('contextmenu', function(e) {
    var pathname = window.location.pathname;
    var restricted = config.restrictedPaths || ['/admin', '/studio', '/dashboard', '/settings'];
    var isRestricted = restricted.some(function(p) { return pathname.indexOf(p) !== -1; }) || isTokenValid(config);
    if (isRestricted) { e.preventDefault(); return false; }
  });
}

function initAntiTamperingGuardian(config: SentinelSDKConfig): void {
  var auditSessionIntegrity = function() {
    try {
      var isLogged = localStorage.getItem(config.adminStorageKey) === 'true';
      var isMfa = localStorage.getItem(config.mfaStorageKey) === 'true';
      if ((isLogged || isMfa) && !isTokenValid(config)) {
        console.warn('[AURA SENTINEL — ' + config.systemId + '] Adulteracao de sessao detectada! Revogando.');
        clearSession(config);
        var pathname = window.location.pathname;
        var restricted = config.restrictedPaths || ['/admin', '/studio', '/dashboard'];
        if (restricted.some(function(p) { return pathname.indexOf(p) !== -1; })) {
          window.location.href = '/';
        }
      }
    } catch(e) { clearSession(config); }
  };
  setInterval(auditSessionIntegrity, 3000);
  window.addEventListener('storage', function(e) {
    if (e.key && e.key.indexOf('@vorcon_') === 0) { auditSessionIntegrity(); }
  });
}

function initFetchInterceptor(config: SentinelSDKConfig): void {
  var originalFetch = window.fetch;
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
    var urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;
    var isVorconApi = urlStr.indexOf('vorcon') !== -1 || urlStr.indexOf('railway.app') !== -1 || urlStr.indexOf('supabase.co') !== -1 || urlStr.indexOf('/api/') === 0;
    if (isVorconApi) {
      var token = getSessionToken(config);
      if (token) {
        var headers = new Headers(init?.headers);
        headers.set('x-aura-sentinel-token', token);
        headers.set('x-aura-sentinel-system', config.systemId);
        init = Object.assign({}, init, { headers: headers });
      }
    }
    return originalFetch(input, init);
  };
}

function initPWABlocker(config: SentinelSDKConfig): void {
  if (!config.enablePWABlock) return;
  window.addEventListener('beforeinstallprompt', function(e) {
    if (!isTokenValid(config)) {
      e.preventDefault();
      console.warn('[AURA SENTINEL — ' + config.systemId + '] Instalacao PWA bloqueada.');
    }
  });
}

export function initAuraSentinelSDK(config: SentinelSDKConfig): void {
  if (typeof window === 'undefined') return;
  initAntiDevToolsShield(config);
  initAntiTamperingGuardian(config);
  initFetchInterceptor(config);
  initPWABlocker(config);
}

export { isTokenValid, clearSession, getSessionToken };
