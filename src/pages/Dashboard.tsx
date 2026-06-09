import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Zap, Shield, Smartphone, QrCode } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { QRCodeSVG } from 'qrcode.react';

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'router.vorcon.com.br'
  ? 'https://vorcon-router-production.up.railway.app'
  : 'http://localhost:3000';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [instances, setInstances] = useState<any[]>([]);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(null);

  const [apiKey, setApiKey] = useState('vr_founder_vorcon_2026');
  const [planName, setPlanName] = useState('TRIAL 48H');
  const [maxInstances, setMaxInstances] = useState(1);
  const [isTrial, setIsTrial] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const fetchInstances = async (currentApiKey = apiKey) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/instances`, {
        headers: {
          'x-api-key': currentApiKey
        }
      });
      if (response.ok) {
        const data = await response.json();
        setInstances(data.instances.map((inst: any) => ({
          id: inst.instanceId,
          name: inst.instanceId === 'vorcon_admin_instance' 
            ? 'WhatsApp Principal (Aegis)' 
            : inst.instanceId === 'vorcon_engage_main'
              ? 'WhatsApp Principal (Engage)'
              : inst.instanceId,
          status: inst.status,
          phone: inst.phone || null
        })));
      }
    } catch (error) {
      console.error('Failed to fetch instances:', error);
    }
  };

  const checkUser = async () => {
    let session = null;
    try {
      const { data } = await supabase.auth.getSession();
      session = data?.session || null;
    } catch (e) {
      console.warn("Supabase auth offline, usando bypass para desenvolvimento local.");
    }

    let currentUser = null;
    if (!session) {
      // Local fallback bypass so development works even if Supabase is paused
      currentUser = {
        email: 'luizviana@vorcon.com.br',
        user_metadata: { full_name: 'Luiz Viana (Local Dev)' }
      };
    } else {
      currentUser = session.user;
    }
    
    setUser(currentUser);

    let activeKey = 'vr_founder_vorcon_2026';
    if (currentUser?.email === 'luizviana@vorcon.com.br' || currentUser?.email === 'luizviana.adm@gmail.com') {
      const isCorp = currentUser.email === 'luizviana@vorcon.com.br';
      activeKey = isCorp ? 'vr_founder_corp_2026' : 'vr_founder_vorcon_2026';
      setApiKey(activeKey);
      setPlanName('ENTERPRISE');
      setMaxInstances(999);
      setIsTrial(false);
    } else {
      setApiKey('vr_founder_vorcon_2026');
      setPlanName('TRIAL 48H');
      setMaxInstances(1);
      setIsTrial(true);
    }
    
    await fetchInstances(activeKey);
    setLoading(false);

    // Polling of 5s for lists update
    const interval = setInterval(() => fetchInstances(activeKey), 5000);
    return () => clearInterval(interval);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const createAdminInstance = async () => {
    try {
      setLoading(true);

      let instanceId = 'vorcon_admin_instance';
      if (planName === 'ENTERPRISE') {
        const customName = prompt("Digite um identificador para esta linha (ex: vorcon_engage_main):", "vorcon_engage_main");
        if (!customName) {
          setLoading(false);
          return;
        }
        instanceId = customName.trim().replace(/\s+/g, '_');
      }

      const res = await fetch(`${API_BASE_URL}/api/instances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({ instanceId })
      });
      if (res.ok) {
        await fetchInstances(apiKey);
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao criar instância.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadQrCode = async (instanceId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/instances/${instanceId}/qr`, {
        headers: {
          'x-api-key': apiKey
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.qr) {
          setQrCodeData(data.qr);
          setActiveInstanceId(instanceId);
        } else {
          alert(data.message || 'QR Code ainda não gerado. Aguarde alguns segundos.');
        }
      }
    } catch (error) {
      console.error('Failed to load QR code:', error);
    }
  };

  // Close modal when status becomes connected
  useEffect(() => {
    let interval: any;
    if (qrCodeData && activeInstanceId) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/instances/${activeInstanceId}/status`, {
            headers: { 'x-api-key': apiKey }
          });
          if (response.ok) {
            const statusInfo = await response.json();
            if (statusInfo.status === 'connected') {
              setQrCodeData(null);
              setActiveInstanceId(null);
              clearInterval(interval);
              fetchInstances(apiKey);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [qrCodeData, activeInstanceId, apiKey]);

  // Keep QR Code updated while modal is open (Baileys QR expires every 20s)
  useEffect(() => {
    let interval: any;
    if (qrCodeData && activeInstanceId) {
      interval = setInterval(() => {
        handleLoadQrCode(activeInstanceId);
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [qrCodeData, activeInstanceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
          className="w-8 h-8 border-4 border-brand-whatsapp/30 border-t-brand-whatsapp rounded-full" 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] font-sans text-slate-200">
      
      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-[#0A0F1C]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-whatsapp flex items-center justify-center">
              <Zap className="w-4 h-4 text-slate-900" />
            </div>
            <span className="font-bold text-white tracking-wide">VORCON ROUTER</span>
            <span className={`ml-4 px-2 py-0.5 rounded text-[10px] font-bold ${
              planName === 'ENTERPRISE' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                : 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30'
            }`}>
              {planName}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium text-white">{user?.user_metadata?.full_name || 'Usuário'}</div>
              <div className="text-xs text-slate-500">{user?.email}</div>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-lg hover:bg-slate-700">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
            <div className="text-slate-400 text-sm font-semibold mb-2 flex items-center gap-2"><Zap className="w-4 h-4 text-brand-whatsapp" /> Instâncias Ativas</div>
            <div className="text-3xl font-bold text-white">
              {instances.filter(i => i.status === 'connected').length}{' '}
              <span className="text-lg text-slate-500 font-normal">
                / {maxInstances === 999 ? 'Ilimitado' : maxInstances}
              </span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
            <div className="text-slate-400 text-sm font-semibold mb-2 flex items-center gap-2"><Shield className="w-4 h-4 text-brand-teal" /> Status do Motor</div>
            <div className="text-xl font-bold text-brand-teal flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-teal animate-pulse" />
              Quantum Fuzzing Online
            </div>
          </div>
          
          {isTrial ? (
            <div className="glass-panel p-6 rounded-2xl border border-brand-blue/30 bg-brand-blue/5">
              <div className="text-brand-blue text-sm font-semibold mb-2">Tempo Restante (Trial)</div>
              <div className="text-3xl font-bold text-white">47h 59m</div>
              <div className="mt-2 text-xs text-slate-400">Expira em 2 dias. Considere fazer o Upgrade.</div>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-emerald-400 text-sm font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Assinatura Premium
              </div>
              <div className="text-3xl font-bold text-white">Ativa / Vitalícia</div>
              <div className="mt-2 text-xs text-emerald-400">Infraestrutura corporativa dedicada e ativa.</div>
            </div>
          )}
        </div>

        {/* Instâncias Manager */}
        <div className="glass-panel rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-slate-400" />
              Suas Linhas de WhatsApp
            </h2>
            <button 
              onClick={createAdminInstance}
              className="px-4 py-2 bg-brand-whatsapp/10 text-brand-whatsapp text-sm font-bold rounded-lg border border-brand-whatsapp/30 hover:bg-brand-whatsapp hover:text-slate-900 transition-colors"
            >
              {planName === 'ENTERPRISE' ? '+ Adicionar Nova Linha' : '+ Adicionar Linha Principal'}
            </button>
          </div>
          
          <div className="p-6">
            {instances.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                Nenhuma instância ativa. Clique em "+ Adicionar Linha Principal" para iniciar.
              </div>
            ) : (
              instances.map(inst => (
                <div key={inst.id} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/50 gap-6 mb-4 last:mb-0">
                  
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                      <Smartphone className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{inst.name}</h3>
                      <div className="text-sm text-slate-500 font-mono mt-0.5">ID: {inst.id}</div>
                      {inst.phone && (
                        <div className="text-xs text-brand-whatsapp/85 font-medium mt-0.5">Telefone: {inst.phone}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    {inst.status === 'connected' && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Conectado
                      </span>
                    )}
                    {inst.status === 'connecting' && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        Conectando...
                      </span>
                    )}
                    {inst.status === 'qr_ready' && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        Aguardando Scan
                      </span>
                    )}
                    {inst.status === 'disconnected' && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                        Desconectado
                      </span>
                    )}
                    
                    {inst.status !== 'connected' && (
                      <button 
                        onClick={() => handleLoadQrCode(inst.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors text-sm border border-slate-600"
                      >
                        <QrCode className="w-4 h-4" />
                        Ler QR Code
                      </button>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </main>

      {/* QR Code Modal */}
      {qrCodeData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setQrCodeData(null)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative glass-panel rounded-2xl w-full max-w-sm overflow-hidden border border-slate-700 shadow-2xl"
          >
            <div className="p-8 flex flex-col items-center">
              <h3 className="text-xl font-bold text-white mb-2">Conectar WhatsApp</h3>
              <p className="text-sm text-slate-400 text-center mb-8">
                Abra o WhatsApp no seu celular, vá em Aparelhos Conectados e aponte a câmera.
              </p>
              
              <div className="bg-white p-4 rounded-xl mb-6">
                <QRCodeSVG value={qrCodeData} size={200} />
              </div>

              <button 
                onClick={() => setQrCodeData(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
