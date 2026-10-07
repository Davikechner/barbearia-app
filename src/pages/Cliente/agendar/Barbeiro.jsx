import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAgendamento } from '../../../context/AgendamentoContext';

const barbeiros = [
  { nome: 'Kauan', desc: 'Especialista em Degradê e Barba' },
  { nome: 'Guilherme', desc: 'Especialista em Cortes Clássicos e Tesoura' },
];

function Barbeiro() {
  const navigate = useNavigate();
  const { agendamento, atualizar } = useAgendamento();

  // Se não escolheu serviço ainda, volta
  if (!agendamento.servico) {
    navigate('/agendar/servico');
    return null;
  }

  const escolher = (barbeiro) => {
    atualizar({ barbeiro: barbeiro.nome });
    navigate('/agendar/horario');
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 antialiased flex justify-center min-h-screen">
      <div className="w-full max-w-md bg-zinc-900 min-h-screen shadow-2xl relative flex flex-col border-x border-zinc-800">
        <header className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900 sticky top-0 z-40">
          <button
            onClick={() => navigate('/agendar/servico')}
            className="text-zinc-400 hover:text-white p-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-sm text-white">Novo Agendamento</h1>
            <p className="text-[11px] text-zinc-400">Passo 2 de 4: Escolha o profissional</p>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-3 overflow-y-auto">
          <h4 className="text-sm font-bold text-zinc-200 mb-2">
            Com quem deseja ser atendido?
          </h4>

          {barbeiros.map((b) => {
            const selecionado = agendamento.barbeiro === b.nome;
            return (
              <button
                key={b.nome}
                onClick={() => escolher(b)}
                className={`w-full p-4 rounded-2xl border flex items-center gap-4 text-left transition-all ${
                  selecionado
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-zinc-800 bg-zinc-900 hover:border-yellow-500/50'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold text-lg">
                  {b.nome[0]}
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-white">{b.nome}</h5>
                  <p className="text-xs text-zinc-400">{b.desc}</p>
                </div>
              </button>
            );
          })}
        </main>
      </div>
    </div>
  );
}

export default Barbeiro;