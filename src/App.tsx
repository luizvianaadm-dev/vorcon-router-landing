import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, Database, Cpu, MessageSquare, Terminal, KeyRound } from 'lucide-react';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [authKey, setAuthKey] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    // Simulate API Gateway Check
    setTimeout(() => {
      setIsAuthenticating(false);
      alert('AURA SENTINEL: Acesso Concedido. Token Efêmero Gerado.');
    }, 1500);
  };

  return (
    <div className="min-h-screen relative font-sans text-slate-200">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-whatsapp/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-blue/10 blur-[120px]" />
        {/* Matrix Grid Lines */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAwdjIwbTIwIDBIMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgzMCwgNDEsIDU5LCAwLjIpIi8+PC9zdmc+')] opacity-20" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-whatsapp to-brand-teal flex items-center justify-center shadow-[0_0_15px_rgba(37,211,102,0.4)]">
            <MessageSquare className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white glow-text">VORCON ROUTER</span>
        </div>
        <button 
          onClick={() => setShowAuth(true)}
          className="px-6 py-2.5 rounded-full bg-slate-800 border border-slate-600 hover:border-brand-whatsapp hover:text-brand-whatsapp transition-all duration-300 flex items-center gap-2 font-medium text-sm"
        >
          <Lock className="w-4 h-4" />
          Acesso Vault
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-whatsapp/10 border border-brand-whatsapp/20 text-brand-whatsapp text-sm font-semibold">
              <Zap className="w-4 h-4" />
              Powered by Quantum Fuzzing
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white">
              Autonomia Total no <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-whatsapp to-brand-glow glow-text">
                WhatsApp Web
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              A API definitiva para desenvolvedores e empresas. Apresentamos o roteador Multi-Device de alta performance, imunizado contra banimentos através da exclusiva tecnologia de <strong>Quantum Fuzzing Comportamental</strong>.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <button className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-whatsapp to-brand-teal text-white font-bold hover:shadow-[0_0_25px_rgba(37,211,102,0.5)] transition-all duration-300 transform hover:-translate-y-1">
                Iniciar Integração
              </button>
              <button className="px-8 py-4 rounded-full glass-panel text-white font-semibold hover:bg-slate-800 transition-all duration-300 flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Ver Documentação
              </button>
            </div>
          </motion.div>

          {/* Code/Terminal Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-whatsapp to-brand-blue opacity-20 blur-3xl rounded-full" />
            <div className="relative glass-panel rounded-2xl overflow-hidden border border-slate-700/50">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50 bg-slate-900/80">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-500">quantum_fuzzing_engine.ts</span>
              </div>
              <div className="p-6 font-mono text-sm overflow-x-auto text-slate-300 bg-[#0A0F1C]">
                <pre>
                  <code className="language-typescript">
<span className="text-pink-500">import</span> &#123; QEngine &#125; <span className="text-pink-500">from</span> <span className="text-green-400">'@vorcon/quantum'</span>;{'\n\n'}
<span className="text-blue-400">async function</span> <span className="text-yellow-200">sendSecureMessage</span>(to, text) &#123;{'\n'}
{'  '}<span className="text-slate-500">// 1. Stochastic Delay Calculation</span>{'\n'}
{'  '}<span className="text-pink-500">const</span> delay = <span className="text-pink-500">await</span> QEngine.<span className="text-yellow-200">generateChaosMatrix</span>();{'\n\n'}
{'  '}<span className="text-slate-500">// 2. Simulate Human Typing</span>{'\n'}
{'  '}<span className="text-pink-500">await</span> BaileysSocket.<span className="text-yellow-200">sendPresenceUpdate</span>(<span className="text-green-400">'composing'</span>, to);{'\n'}
{'  '}<span className="text-pink-500">await</span> <span className="text-yellow-200">sleep</span>(delay.typingTimeMs);{'\n\n'}
{'  '}<span className="text-slate-500">// 3. Dispatch Encrypted Payload</span>{'\n'}
{'  '}<span className="text-pink-500">return</span> <span className="text-pink-500">await</span> BaileysSocket.<span className="text-yellow-200">sendMessage</span>(to, &#123; text &#125;);{'\n'}
&#125;
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <FeatureCard 
            icon={<Shield />}
            title="Arquitetura Zero-Trust"
            desc="M2M Tokens efêmeros garantem segurança absoluta. Suas chaves-mestras nunca trafegam pela rede, blindando sua infraestrutura e garantindo conformidade total."
          />
          <FeatureCard 
            icon={<Cpu />}
            title="Quantum Anti-Ban Engine"
            desc="O algoritmo simula pausas orgânicas e tempo de digitação idêntico ao de uma pessoa real (Quantum Fuzzing). Seus fluxos automáticos ganham cadência natural, mitigando bloqueios automatizados."
          />
          <FeatureCard 
            icon={<Database />}
            title="Soberania de Infraestrutura"
            desc="Reduza o Custo de Aquisição Tecnológica com nossa API escalável. Tenha domínio absoluto sobre os seus nós de comunicação e instâncias WebSocket."
          />
        </div>

        {/* Pricing Section */}
        <div className="mt-32 border-t border-slate-800 pt-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">Planos Simples. Escala Infinita.</h2>
            <p className="text-slate-400">Desenvolvido por Auditores de Tecnologia para Empresas de Alta Performance.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Plan */}
            <div className="glass-panel p-8 rounded-2xl border border-slate-700/50 hover:border-brand-whatsapp/50 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-2">Plano Pro</h3>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-whatsapp to-brand-teal mb-6">
                R$ 89,90 <span className="text-sm text-slate-400 font-normal">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 text-slate-300">
                <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-brand-whatsapp" /> 1 Instância WhatsApp Inclusa</li>
                <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-brand-whatsapp" /> API REST Completa</li>
                <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-brand-whatsapp" /> Quantum Fuzzing Anti-Ban</li>
                <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-slate-500" /> +R$ 29,90 por Instância Adicional</li>
              </ul>
              <a 
                href={import.meta.env.VITE_ASAAS_PAYMENT_URL || "https://www.asaas.com/c/bwxhqc6ejdkss5ht"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors block text-center"
              >
                Assinar Agora
              </a>
            </div>

            {/* Founder/Enterprise Plan */}
            <div className="glass-panel p-8 rounded-2xl border border-brand-glow/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-glow text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                ENTERPRISE
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Corporativo</h3>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-glow to-brand-blue mb-6">
                Sob Medida
              </div>
              <ul className="space-y-4 mb-8 text-slate-300">
                <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-brand-glow" /> Instâncias Ilimitadas</li>
                <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-brand-glow" /> Infraestrutura Dedicada</li>
                <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-brand-glow" /> SLA Garantido 99.9%</li>
                <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-brand-glow" /> Suporte VIP (Diretoria)</li>
              </ul>
              <a 
                href="https://wa.me/5571994010014?text=Ol%C3%A1!%20Gostaria%20de%20falar%20sobre%20o%20plano%20Enterprise%20do%20Vorcon%20Router." 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-glow text-white font-bold shadow-[0_0_15px_rgba(14,165,233,0.3)] block text-center hover:shadow-[0_0_25px_rgba(14,165,233,0.6)] transition-all"
              >
                Falar com Especialista
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Auth Modal (Omnichannel Vault Simulation) */}
      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAuth(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative glass-panel rounded-2xl w-full max-w-md overflow-hidden"
          >
            <div className="h-2 bg-gradient-to-r from-brand-blue via-brand-glow to-brand-whatsapp" />
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
                  <KeyRound className="w-8 h-8 text-brand-glow" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-white mb-2">Vorcon Omnichannel Vault</h2>
              <p className="text-center text-slate-400 text-sm mb-8">
                Autenticação requerida pela <strong>AURA Sentinel</strong> para acesso à API Key do Roteador.
              </p>

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Service Role / API Key</label>
                  <input 
                    type="password"
                    value={authKey}
                    onChange={(e) => setAuthKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-glow focus:ring-1 focus:ring-brand-glow transition-all font-mono"
                    placeholder="sk_live_..."
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full bg-gradient-to-r from-brand-blue to-brand-glow text-white font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  {isAuthenticating ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Solicitar Token Efêmero
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-panel p-8 rounded-2xl border border-slate-700/50 hover:border-brand-whatsapp/30 transition-all duration-300 group hover:-translate-y-2">
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-brand-whatsapp mb-6 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(37,211,102,0.2)] transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}

export default App;
