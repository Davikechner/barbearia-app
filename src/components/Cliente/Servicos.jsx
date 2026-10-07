import { User, Sparkles, Flame, Eye, Scissors } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAgendamento } from '../../context/AgendamentoContext';

const servicos = [
  { nome: 'Corte', desc: 'Estilo moderno ou clássico', preco: 40, Icone: User },
  { nome: 'Barba', desc: 'Toalha quente e navalha', preco: 30, Icone: Sparkles },
  { nome: 'Corte + Barba', desc: 'Combo completo', preco: 65, Icone: Flame },
  { nome: 'Sobrancelha', desc: 'Alinhamento perfeito', preco: 20, Icone: Eye },
];

function Servicos() {
  const navigate = useNavigate();
  const { atualizar } = useAgendamento();

  const escolher = (servico) => {
    atualizar({ servico: { nome: servico.nome, preco: servico.preco } });
    navigate('/agendar/barbeiro');
  };

  return (
    <section id="servicos" className="mt-12 sm:mt-16 lg:mt-20">
      <div className="flex justify-between items-end mb-5 sm:mb-8">
        <div>
          <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl text-white flex items-center gap-2">
            <Scissors className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            Nossos Serviços
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Escolha um serviço para agendar
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {servicos.map((s) => (
          <div
            key={s.nome}
            onClick={() => escolher(s)}
            className="bg-zinc-800/60 border border-zinc-800 p-4 sm:p-5 lg:p-6 rounded-2xl cursor-pointer hover:border-yellow-500/50 hover:-translate-y-1 transition-all"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-3">
              <s.Icone className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-semibold text-sm sm:text-base text-white">{s.nome}</h4>
            <p className="text-xs sm:text-sm text-zinc-400 mb-3">{s.desc}</p>
            <span className="text-sm sm:text-base font-bold text-yellow-400">
              R$ {s.preco.toFixed(2).replace('.', ',')}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Servicos;