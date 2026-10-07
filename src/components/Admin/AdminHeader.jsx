import { Scissors, Plus, Clock, UserCircle2, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBarbeiro } from '../../context/BarbeiroContext';
import { fazerLogout } from '../../api';

const BARBEIROS = ['Kauan', 'Guilherme'];

function AdminHeader({ onNovoAgendamento }) {
  const [agora, setAgora] = useState(new Date());
  const { barbeiroLogado, setBarbeiroLogado } = useBarbeiro();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const horaFormatada = agora.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const sair = async () => {
    if (!confirm('Deseja sair do painel?')) return;
    await fazerLogout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-0 sm:h-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Linha 1: Logo */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20 shrink-0">
              <Scissors className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold tracking-tight bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 bg-clip-text text-transparent leading-tight truncate">
                GUI BARBEIRO
              </h1>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-medium leading-tight truncate">
                Painel Administrativo
              </p>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-full text-xs font-medium text-yellow-400 shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>{horaFormatada}</span>
          </div>
        </div>

        {/* Linha 2 (mobile): Barbeiro + Novo + Sair */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 rounded-full p-1 flex-1 min-w-0">
            {BARBEIROS.map((nome) => (
              <button
                key={nome}
                onClick={() => setBarbeiroLogado(nome)}
                className={`flex-1 px-2 py-1.5 rounded-full text-[11px] font-semibold transition-all truncate ${
                  barbeiroLogado === nome
                    ? 'bg-yellow-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {nome}
              </button>
            ))}
          </div>

          <button
            onClick={onNovoAgendamento}
            className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-zinc-950 px-3 py-2 rounded-xl font-semibold text-xs shadow-lg shadow-yellow-500/20 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Novo</span>
          </button>

          <button
            onClick={sair}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-900 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-zinc-800 transition-all shrink-0"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;