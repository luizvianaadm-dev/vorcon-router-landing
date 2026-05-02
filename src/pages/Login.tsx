import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Shield, AlertCircle, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // AURA Sentinel State (Easter Egg)
  const [shieldClicks, setShieldClicks] = useState(0);
  const [isAuraMode, setIsAuraMode] = useState(false);

  const handleShieldClick = () => {
    if (shieldClicks + 1 >= 3) {
      setIsAuraMode(true);
      setError('');
    } else {
      setShieldClicks(prev => prev + 1);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuraAuth = () => {
    // Simulação do clique no Raiozinho para autenticar como Master
    setLoading(true);
    setTimeout(() => {
      // In a real scenario, this would trigger WebAuthn or a specific AURA API endpoint
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen relative font-sans text-slate-200 flex items-center justify-center p-4 overflow-hidden bg-black">
      
      {/* Background Video */}
      <div className="absolute inset-0 z-0 opacity-30">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="/login-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-[#0A0F1C]/80 to-black/40" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 backdrop-blur-xl bg-[#0A0F1C]/60">
          <div className={`h-1.5 bg-gradient-to-r ${isAuraMode ? 'from-brand-glow via-brand-whatsapp to-brand-glow' : 'from-brand-whatsapp via-brand-teal to-brand-blue'}`} />
          
          <div className="p-10">
            
            {/* Header Icon (Shield for Normal, Lightning for AURA) */}
            <div className="flex justify-center mb-8">
              {!isAuraMode ? (
                <div 
                  onClick={handleShieldClick}
                  className="w-20 h-20 rounded-2xl bg-slate-900 border border-brand-whatsapp/40 flex items-center justify-center shadow-[0_0_30px_rgba(37,211,102,0.3)] transform -rotate-6 hover:rotate-0 transition-all duration-500 cursor-pointer"
                >
                  <KeyRound className="w-10 h-10 text-brand-whatsapp" />
                </div>
              ) : (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 rounded-full bg-slate-900 border border-brand-glow flex items-center justify-center shadow-[0_0_50px_rgba(37,211,102,0.5)]"
                >
                  <Zap className="w-12 h-12 text-brand-glow animate-pulse" />
                </motion.div>
              )}
            </div>

            <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">
              {isAuraMode ? 'Vorcon Omnichannel Vault' : 'Acesso ao Vault'}
            </h2>
            <p className="text-center text-slate-400 text-sm mb-8">
              {isAuraMode ? 'Aguardando conexão da chave AURA Sentinel...' : 'Autenticação segura para clientes.'}
            </p>

            {error && !isAuraMode && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3 backdrop-blur-md">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </motion.div>
            )}

            {/* Form for Normal Mode, Glowing Lightning for AURA Mode */}
            {!isAuraMode ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">E-mail de Acesso</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-whatsapp focus:ring-1 focus:ring-brand-whatsapp transition-all backdrop-blur-sm" placeholder="admin@empresa.com.br" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Senha</label>
                  </div>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-whatsapp focus:ring-1 focus:ring-brand-whatsapp transition-all font-mono backdrop-blur-sm" placeholder="••••••••" />
                </div>
                <button type="submit" disabled={loading} className="w-full mt-8 bg-gradient-to-r from-brand-whatsapp to-brand-teal text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_35px_rgba(37,211,102,0.5)] transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1">
                  {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full" /> : <><Shield className="w-5 h-5" /> Decodificar Acesso</>}
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <button 
                  onClick={handleAuraAuth}
                  disabled={loading}
                  className="w-20 h-20 flex items-center justify-center rounded-full bg-brand-glow/20 border border-brand-glow hover:bg-brand-glow/40 transition-all hover:shadow-[0_0_40px_rgba(37,211,102,0.6)] group"
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-4 border-brand-glow/30 border-t-brand-glow rounded-full" />
                  ) : (
                    <Zap className="w-10 h-10 text-brand-glow group-hover:scale-110 transition-transform" />
                  )}
                </button>
                <p className="mt-6 text-xs text-brand-glow font-mono uppercase tracking-widest animate-pulse">
                  Ready to link
                </p>
              </div>
            )}

            {!isAuraMode && (
              <div className="mt-8 text-center pt-6 border-t border-slate-800">
                <p className="text-sm text-slate-400">
                  Não tem uma credencial? <Link to="/register" className="text-brand-whatsapp font-semibold hover:text-white transition-colors">Solicite seu Trial</Link>
                </p>
              </div>
            )}
            
          </div>
        </div>
      </motion.div>
    </div>
  );
}
