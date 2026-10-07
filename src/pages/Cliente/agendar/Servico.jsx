import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faScissors,
  faUserLarge,
  faFire,
  faEye,
  faWandMagicSparkles,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAgendamento } from '../../../context/AgendamentoContext';

const SERVICOS = [
  { nome: 'Corte', desc: 'Aprox. 40 min', preco: 40, Icone: faScissors },
  { nome: 'Barba', desc: 'Aprox. 30 min', preco: 30, Icone: faUserLarge },
  { nome: 'Corte + Barba', desc: 'Aprox. 60 min', preco: 65, Icone: faFire },
  { nome: 'Sobrancelha', desc: 'Aprox. 15 min', preco: 20, Icone: faEye },
  { nome: 'Platinado / Nevou', desc: 'Aprox. 90 min', preco: 180, Icone: faWandMagicSparkles },
  { nome: 'Luzes', desc: 'Aprox. 80 min', preco: 150, Icone: faLightbulb },
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
        <header className="px-5 py-4 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-40">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/')}
              className="text-zinc-400 hover:text-white p-1 -ml-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-sm text-white truncate">
                Novo Agendamento
              </h1>
              <p className="text-[11px] text-zinc-400">
                Passo 1 de 4 · Escolha o serviço
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  n <= 1 ? 'bg-yellow-500' : 'bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </header>

        <main className="flex-1 p-5 space-y-3 overflow-y-auto">
          <h4 className="text-sm font-bold text-zinc-200 mb-1">
            Qual serviço você deseja?
          </h4>

          {SERVICOS.map((s) => {
            const selecionado = agendamento.servico?.nome === s.nome;
            return (
              <button
                key={s.nome}
                onClick={() => escolher(s)}
                className={`w-full p-4 rounded-2xl border flex items-center gap-4 text-left transition-all ${
                  selecionado
                    ? 'border-yellow-500 bg-yellow-500/10 shadow-md shadow-yellow-500/10'
                    : 'border-zinc-800 bg-zinc-900 hover:border-yellow-500/50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    selecionado
                      ? 'bg-yellow-500 text-zinc-950'
                      : 'bg-yellow-500/10 text-yellow-400'
                  }`}
                >
                  <FontAwesomeIcon icon={s.Icone} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-sm text-white leading-tight">
                    {s.nome}
                  </h5>
                  <p className="text-xs text-zinc-400 leading-tight mt-0.5">
                    {s.desc}
                  </p>
                </div>
                <span className="font-bold text-sm text-yellow-400 shrink-0">
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