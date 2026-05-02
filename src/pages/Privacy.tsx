import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] font-sans text-slate-200 py-16 px-6">
      <div className="max-w-3xl mx-auto glass-panel p-10 rounded-2xl border border-slate-700/50 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-brand-teal/30 flex items-center justify-center">
            <Lock className="w-6 h-6 text-brand-teal" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Política de Privacidade</h1>
            <p className="text-brand-teal text-sm font-mono mt-1">VORCON AIO LTDA</p>
          </div>
        </div>
        
        <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
          <p>
            A <strong>VORCON AIO LTDA</strong> valoriza a sua privacidade. Esta política descreve como coletamos, usamos, protegemos e armazenamos os seus dados ao utilizar o Vorcon Router.
          </p>
          
          <h2 className="text-lg font-semibold text-white mt-8 mb-4">1. Coleta de Dados</h2>
          <p>
            Coletamos as seguintes informações corporativas e de acesso para a prestação do serviço:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Dados de cadastro (Nome, E-mail, WhatsApp, Documento).</li>
            <li>Logs operacionais básicos (conexão das instâncias de WhatsApp) para fins de tarifação e estabilidade.</li>
            <li>Metadados de autenticação do AURA Sentinel (para contas administrativas).</li>
          </ul>
          
          <h2 className="text-lg font-semibold text-white mt-8 mb-4">2. Arquitetura Zero-Trust</h2>
          <p>
            Nossa infraestrutura opera sob o modelo <em>Zero-Trust</em>. O conteúdo (textos, mídias) trafegado pelas suas instâncias <strong>não é armazenado em nossos bancos de dados</strong> de longo prazo. As mensagens são roteadas em tempo real entre o cliente e os nós do <em>Baileys Engine</em>.
          </p>

          <h2 className="text-lg font-semibold text-white mt-8 mb-4">3. Compartilhamento de Dados</h2>
          <p>
            Não vendemos nem alugamos suas informações para terceiros. O compartilhamento ocorre estritamente com:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Asaas:</strong> Para processamento seguro de pagamentos e emissão de notas.</li>
            <li><strong>Supabase:</strong> Para gestão isolada do banco de dados multitenant.</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-8 mb-4">4. Seus Direitos (LGPD)</h2>
          <p>
            Você tem o direito de solicitar a exclusão definitiva da sua conta, revogação do token do WhatsApp e apagamento dos dados cadastrais a qualquer momento através do seu Dashboard ou acionando nosso suporte (DPO).
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <Link to="/register" className="text-brand-teal hover:underline font-semibold">Voltar para o Cadastro</Link>
        </div>
      </div>
    </div>
  );
}
