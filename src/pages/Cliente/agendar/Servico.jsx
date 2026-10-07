import { ArrowLeft, User, Sparkles, Flame, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAgendamento } from '../../../context/AgendamentoContext';

const servicos = [
  { nome: 'Corte', desc: 'Aprox. 40 min', preco: 40, Icone: User },
  { nome: 'Barba', desc: 'Aprox. 30 min', preco: 30, Icone: Sparkles },
  { nome: 'Corte + Barba', desc: 'Aprox. 60 min', preco: 65, Icone: Flame },
  { nome: 'Sobrancelha', desc: 'Aprox. 15 min', preco: 20, Icone: Eye },
];

function Servico() {
  const navigate = useNavigate();
  const { agendamento, atualizar } = useAgendamento();

  const escolher = (servico) => {
    atualizar({ servico: { nome: servico.nome, preco: servico.preco } });
    navigate('/agendar/barbeiro');
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 antialiased flex justify-center min-h-screen">
      <div className="w-full max-w-md bg-zinc-900 min-h-screen shadow-2xl relative flex flex-col border-x border-zinc-800">
        <header className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900 sticky top-0 z-40">
          <button
            onClick={() => navigate('/')}
            className="text-zinc-400 hover:text-white p-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-sm text-white">Novo Agendamento</h1>
            <p className="text-[11px] text-zinc-400">Passo 1 de 4: Escolha o serviço</p>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-3 overflow-y-auto">
          <h4 className="text-sm font-bold text-zinc-200 mb-2">
            Qual serviço você deseja?
          </h4>

          {servicos.map((s) => {
            const selecionado = agendamento.servico?.nome === s.nome;
            return (
              <button
                key={s.nome}
                onClick={() => escolher(s)}
                className={`w-full p-4 rounded-2xl border flex justify-between items-center text-left transition-all ${
                  selecionado
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-zinc-800 bg-zinc-900 hover:border-yellow-500/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
                    <s.Icone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-white">{s.nome}</h5>
                    <p className="text-xs text-zinc-400">{s.desc}</p>
                  </div>
                </div>
                <span className="font-bold text-sm text-yellow-400">
                  R$ {s.preco.toFixed(2).replace('.', ',')}
                </span>
              </button>
            );
          })}
        </main>
      </div>
    </div>
  );
}

export default Servico;