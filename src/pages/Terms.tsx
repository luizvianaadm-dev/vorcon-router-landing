import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] font-sans text-slate-200 py-16 px-6">
      <div className="max-w-3xl mx-auto glass-panel p-10 rounded-2xl border border-slate-700/50 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-brand-whatsapp/30 flex items-center justify-center">
            <Shield className="w-6 h-6 text-brand-whatsapp" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Termos de Uso</h1>
            <p className="text-brand-whatsapp text-sm font-mono mt-1">VORCON AIO LTDA</p>
          </div>
        </div>
        
        <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
          <p>
            Bem-vindo ao <strong>Vorcon Router</strong>. Estes Termos de Uso regem o seu acesso e uso do ecossistema de roteamento desenvolvido e licenciado pela <strong>VORCON AIO LTDA</strong>, operadora oficial das licenças de software da Vorcon Holding LTDA.
          </p>
          
          <h2 className="text-lg font-semibold text-white mt-8 mb-4">1. Aceitação dos Termos</h2>
          <p>
            Ao criar uma conta ou utilizar nossa API, você concorda em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis. Se você não concorda com qualquer parte destes termos, não deverá utilizar nossos serviços.
          </p>
          
          <h2 className="text-lg font-semibold text-white mt-8 mb-4">2. Licença e Restrições</h2>
          <p>
            A <strong>VORCON AIO LTDA</strong> concede a você uma licença limitada, não exclusiva e intransferível para usar a plataforma de acordo com o plano contratado. É expressamente proibido:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Tentar descompilar, fazer engenharia reversa ou contornar nossa tecnologia de <em>Quantum Fuzzing</em>.</li>
            <li>Utilizar a plataforma para envio de spam não autorizado, campanhas ilegais ou atividades que violem os Termos de Serviço do provedor final (WhatsApp/Meta).</li>
            <li>Revender o acesso à API sem um contrato corporativo de <em>White-label</em> ativo.</li>
          </ul>

          <h2 className="text-lg font-semibold text-white mt-8 mb-4">3. Pagamento e Trial</h2>
          <p>
            Oferecemos um período de testes gratuito (Trial) de 48 horas. Após esse período, o uso continuado da infraestrutura exigirá a assinatura de um plano via nosso gateway de pagamentos (Asaas). A inadimplência resultará na suspensão automatizada das instâncias.
          </p>

          <h2 className="text-lg font-semibold text-white mt-8 mb-4">4. Isenção de Garantias</h2>
          <p>
            O serviço é fornecido "no estado em que se encontra". Embora o nosso sistema Anti-Ban minimize drasticamente os riscos, não garantimos imunidade absoluta contra bloqueios pelas redes das operadoras finais, visto que o conteúdo trafegado é de inteira responsabilidade do contratante.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <Link to="/register" className="text-brand-whatsapp hover:underline font-semibold">Voltar para o Cadastro</Link>
        </div>
      </div>
    </div>
  );
}
