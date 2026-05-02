import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Shield, AlertCircle, PlaySquare } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      // Autenticado com sucesso, vai pro dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-slate-200 flex items-center justify-center p-4 overflow-hidden bg-black">
      
      {/* Background Video (Placeholder for the FLOW video) */}
      <div className="absolute inset-0 z-0 opacity-30">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          {/* O vídeo será inserido aqui. Enquanto não tem, usamos o gradiente do fallback */}
          <source src="/login-bg.mp4" type="video/mp4" />
        </video>
        {/* Overlay Dark Gradient para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-[#0A0F1C]/80 to-black/40" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 backdrop-blur-xl bg-[#0A0F1C]/60">
          <div className="h-1.5 bg-gradient-to-r from-brand-whatsapp via-brand-teal to-brand-blue" />
          <div className="p-10">
            
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-brand-whatsapp/40 flex items-center justify-center shadow-[0_0_30px_rgba(37,211,102,0.3)] transform -rotate-6 hover:rotate-0 transition-all duration-500">
                <KeyRound className="w-10 h-10 text-brand-whatsapp" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">Acesso ao Vault</h2>
            <p className="text-center text-slate-400 text-sm mb-8">
              Autenticação segura via <strong>AURA Sentinel</strong>.
            </p>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3 backdrop-blur-md"
              >
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">E-mail de Acesso</label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-whatsapp focus:ring-1 focus:ring-brand-whatsapp transition-all backdrop-blur-sm"
                  placeholder="admin@empresa.com.br"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Master Password</label>
                  <a href="#" className="text-xs text-brand-whatsapp/80 hover:text-brand-whatsapp transition-colors">Esqueceu a senha?</a>
                </div>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-whatsapp focus:ring-1 focus:ring-brand-whatsapp transition-all font-mono backdrop-blur-sm"
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-gradient-to-r from-brand-whatsapp to-brand-teal text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_35px_rgba(37,211,102,0.5)] transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1"
              >
                {loading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Decodificar Acesso
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-slate-800">
              <p className="text-sm text-slate-400">
                Não tem uma credencial? <Link to="/register" className="text-brand-whatsapp font-semibold hover:text-white transition-colors">Solicite seu Trial</Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
