import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    document: '', // CPF ou CNPJ
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Criar Auth no Supabase
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            whatsapp: formData.whatsapp,
            document: formData.document
          }
        }
      });

      if (signUpError) throw signUpError;

      // 2. Enviar Lead para N8N/Telegram
      // Obs: Mudar a URL abaixo para o Webhook real do N8N depois
      try {
        await fetch(import.meta.env.VITE_N8N_LEAD_WEBHOOK_URL || 'https://hook.us1.make.com/placeholder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'new_lead_router',
            name: formData.name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            document: formData.document,
            timestamp: new Date().toISOString()
          })
        });
      } catch (err) {
        console.error('Falha ao enviar webhook', err);
        // Não trava o fluxo se o webhook falhar
      }

      // 3. Redirecionar para Dashboard
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] font-sans text-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-whatsapp/5 blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
          <div className="h-2 bg-gradient-to-r from-brand-whatsapp via-brand-teal to-brand-blue" />
          <div className="p-8">
            
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-brand-whatsapp/30 flex items-center justify-center shadow-[0_0_15px_rgba(37,211,102,0.2)]">
                <Shield className="w-8 h-8 text-brand-whatsapp" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-white mb-2">Criar Conta</h2>
            <p className="text-center text-slate-400 text-sm mb-8">
              Inicie seu teste gratuito de 48 horas e tenha acesso à infraestrutura.
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nome / Empresa</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-whatsapp focus:ring-1 focus:ring-brand-whatsapp transition-all"
                  placeholder="Seu nome ou Razão Social"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">E-mail Profissional</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-whatsapp focus:ring-1 focus:ring-brand-whatsapp transition-all"
                  placeholder="voce@empresa.com.br"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">WhatsApp</label>
                  <input 
                    type="tel"
                    required
                    value={formData.whatsapp}
                    onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-whatsapp focus:ring-1 focus:ring-brand-whatsapp transition-all"
                    placeholder="551199999999"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">CPF / CNPJ</label>
                  <input 
                    type="text"
                    required
                    value={formData.document}
                    onChange={e => setFormData({...formData, document: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-whatsapp focus:ring-1 focus:ring-brand-whatsapp transition-all"
                    placeholder="Somente números"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Senha</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-whatsapp focus:ring-1 focus:ring-brand-whatsapp transition-all font-mono"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-4">
                <input 
                  type="checkbox" 
                  id="terms" 
                  required 
                  className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-brand-whatsapp focus:ring-brand-whatsapp focus:ring-offset-slate-900" 
                />
                <label htmlFor="terms" className="text-xs text-slate-400 leading-relaxed">
                  Eu concordo com os <Link to="/termos" className="text-brand-whatsapp hover:underline">Termos de Uso</Link> e a <Link to="/privacidade" className="text-brand-whatsapp hover:underline">Política de Privacidade</Link> da VORCON AIO LTDA.
                </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-brand-whatsapp to-brand-teal text-white font-bold py-3.5 rounded-lg hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <KeyRound className="w-5 h-5" />
                    Iniciar Trial de 48h
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                Já possui uma conta? <Link to="/login" className="text-brand-whatsapp hover:underline">Acesse o Vault</Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
