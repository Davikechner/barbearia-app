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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <Scissors className="w-6 h-6 text-zinc-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              GUI BARBEIRO
            </h1>
            <p className="text-xs text-zinc-400 font-medium">Painel Administrativo</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-full p-1">
            <div className="flex items-center pl-2 pr-1 text-zinc-500">
              <UserCircle2 className="w-4 h-4" />
            </div>
            {BARBEIROS.map((nome) => (
              <button
                key={nome}
                onClick={() => setBarbeiroLogado(nome)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  barbeiroLogado === nome
                    ? 'bg-yellow-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {nome}
              </button>
            ))}
          </div>

          <div className="hidden xl:flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-full text-xs font-medium text-yellow-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{horaFormatada}</span>
          </div>

          <button
            onClick={onNovoAgendamento}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-zinc-950 px-3 sm:px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-lg shadow-yellow-500/20 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Novo Agendamento</span>
            <span className="sm:hidden">Novo</span>
          </button>

          <button
            onClick={sair}
            className="flex items-center justify-center p-2.5 rounded-xl bg-zinc-900 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-zinc-800 transition-all"
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