import { useState } from 'react';
import {
  ArrowLeft,
  Scissors,
  User,
  Calendar as CalendarIcon,
  Clock,
  UserCircle2,
  Phone,
  Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAgendamento } from '../../../context/AgendamentoContext';

function Confirmar() {
  const navigate = useNavigate();
  const { agendamento, atualizar } = useAgendamento();
  const [nome, setNome] = useState(agendamento.nome || '');
  const [whatsapp, setWhatsapp] = useState(agendamento.whatsapp || '');

  if (
    !agendamento.servico ||
    !agendamento.barbeiro ||
    !agendamento.data ||
    !agendamento.horario
  ) {
    navigate('/agendar/servico');
    return null;
  }

  const formatarData = (iso) => {
    if (!iso) return '';
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const valido = nome.trim() && whatsapp.trim();

  const confirmar = () => {
    if (!valido) return;
    atualizar({ nome, whatsapp });
    navigate('/agendar/sucesso');
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 antialiased flex justify-center min-h-screen">
      <div className="w-full max-w-md bg-zinc-900 min-h-screen shadow-2xl relative flex flex-col border-x border-zinc-800">
        <header className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900 sticky top-0 z-40">
          <button
            onClick={() => navigate('/agendar/horario')}
            className="text-zinc-400 hover:text-white p-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-sm text-white">Novo Agendamento</h1>
            <p className="text-[11px] text-zinc-400">
              Passo 4 de 4: Confirmar dados
            </p>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-5 overflow-y-auto">
          {/* Resumo do agendamento */}
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Resumo do agendamento
            </h4>
            <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Scissors className="w-3.5 h-3.5 text-yellow-500" />
                  <span>Serviço</span>
                </div>
                <span className="text-sm font-semibold text-zinc-100">
                  {agendamento.servico.nome}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <User className="w-3.5 h-3.5 text-yellow-500" />
                  <span>Barbeiro</span>
                </div>
                <span className="text-sm font-semibold text-zinc-100">
                  {agendamento.barbeiro}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <CalendarIcon className="w-3.5 h-3.5 text-yellow-500" />
                  <span>Data</span>
                </div>
                <span className="text-sm font-semibold text-zinc-100">
                  {formatarData(agendamento.data)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-yellow-500" />
                  <span>Horário</span>
                </div>
                <span className="text-sm font-semibold text-yellow-400">
                  {agendamento.horario}
                </span>
              </div>

              <div className="border-t border-zinc-700/60 pt-3 flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-300">
                  Total a Pagar
                </span>
                <span className="text-base font-bold text-yellow-400">
                  R$ {agendamento.servico.preco.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </section>

          {/* Formulário de contato */}
          <section>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Seus dados
            </h4>
            <div className="space-y-3">
              <div className="relative">
                <UserCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
            </div>
          </section>

          <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
            Ao confirmar, enviaremos os detalhes do agendamento para o seu
            WhatsApp.
          </p>
        </main>

        <footer className="p-4 border-t border-zinc-800 bg-zinc-900">
          <button
            onClick={confirmar}
            disabled={!valido}
            className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl text-sm transition-all ${
              valido
                ? 'bg-yellow-500 hover:bg-yellow-600 text-zinc-950'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" strokeWidth={3} />
            Confirmar Agendamento
          </button>
        </footer>
      </div>
    </div>
  );
}

export default Confirmar;