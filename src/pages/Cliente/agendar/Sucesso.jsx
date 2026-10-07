import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAgendamento } from '../../../context/AgendamentoContext';

function Sucesso() {
  const navigate = useNavigate();
  const { agendamento, resetar } = useAgendamento();

  const formatarData = (iso) => {
    if (!iso) return '';
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const finalizar = () => {
    resetar();
    navigate('/');
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 antialiased flex justify-center min-h-screen">
      <div className="w-full max-w-md bg-zinc-900 min-h-screen shadow-2xl relative flex flex-col border-x border-zinc-800">
        <main className="flex-1 p-6 flex flex-col justify-center text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Check className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-xl font-bold text-white mb-1">
              Agendamento confirmado!
            </h4>
            <p className="text-xs text-zinc-400">
              Seu horário foi reservado com sucesso.
            </p>
          </div>

          <div className="bg-zinc-800/60 border border-zinc-800 rounded-2xl p-4 text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Serviço</span>
              <span className="font-semibold text-white">
                {agendamento.servico?.nome}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Profissional</span>
              <span className="font-semibold text-white">
                {agendamento.barbeiro}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Data</span>
              <span className="font-semibold text-white">
                {formatarData(agendamento.data)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Horário</span>
              <span className="font-semibold text-yellow-400">
                {agendamento.horario}
              </span>
            </div>
            <div className="border-t border-zinc-700/60 pt-2 flex justify-between text-xs">
              <span className="text-zinc-400">Valor</span>
              <span className="font-bold text-yellow-400">
                R$ {agendamento.servico?.preco.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <button
            onClick={finalizar}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-zinc-950 font-bold py-3 rounded-xl text-sm transition-all"
          >
            Voltar ao Início
          </button>

          <p className="text-[11px] text-zinc-500">
            Enviaremos os detalhes para o WhatsApp informado.
          </p>
        </main>
      </div>
    </div>
  );
}

export default Sucesso;