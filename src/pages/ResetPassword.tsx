import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/dashboard',
      });
      if (resetError) throw resetError;
      
      setMessage('Instruções enviadas! Verifique sua caixa de e-mail.');
      setTimeout(() => navigate('/login'), 4000);
    } catch (err: any) {
      setError(err.message || 'Erro ao solicitar redefinição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-slate-200 flex items-center justify-center p-4 overflow-hidden bg-[#0A0F1C]">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-whatsapp/5 blur-[120px]" />
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 backdrop-blur-xl bg-slate-900/60">
          <div className="h-1 bg-gradient-to-r from-brand-whatsapp to-brand-teal" />
          
          <div className="p-8">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Vault
            </Link>

            <h2 className="text-2xl font-bold text-white mb-2">Redefinir Senha</h2>
            <p className="text-slate-400 text-sm mb-6">
              Digite seu e-mail corporativo. Enviaremos um link seguro para criar uma nova credencial de acesso.
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {message && (
              <div className="mb-6 p-4 rounded-lg bg-brand-whatsapp/10 border border-brand-whatsapp/30 flex items-start gap-3">
                <Shield className="w-5 h-5 text-brand-whatsapp shrink-0 mt-0.5" />
                <p className="text-sm text-green-200">{message}</p>
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">E-mail</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-whatsapp focus:ring-1 focus:ring-brand-whatsapp transition-all" placeholder="admin@empresa.com.br" />
              </div>
              
              <button type="submit" disabled={loading || !!message} className="w-full mt-4 bg-slate-800 border border-slate-600 text-white font-bold py-4 rounded-xl hover:border-brand-whatsapp hover:text-brand-whatsapp transition-all flex items-center justify-center gap-3">
                {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <><KeyRound className="w-4 h-4" /> Solicitar Link</>}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
