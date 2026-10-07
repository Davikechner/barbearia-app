import { Scissors } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-yellow-500 flex items-center justify-center text-zinc-950 shadow-md shadow-yellow-500/20">
            <Scissors className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg tracking-tight text-white leading-tight">
              Gui Barbeiro
            </h1>
            <p className="text-[11px] sm:text-xs text-zinc-400">Estilo & Tradição</p>
          </div>
        </div>

        {/* Menu — só aparece no desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#servicos" className="text-sm text-zinc-300 hover:text-yellow-400 transition-colors">
            Serviços
          </a>
          <a href="#trabalhos" className="text-sm text-zinc-300 hover:text-yellow-400 transition-colors">
            Trabalhos
          </a>
          <a href="#localizacao" className="text-sm text-zinc-300 hover:text-yellow-400 transition-colors">
            Localização
          </a>
        </nav>

        <button
          onClick={() => navigate('/agendar/servico')}
          className="text-xs sm:text-sm bg-yellow-500 hover:bg-yellow-600 text-zinc-950 font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all shadow-sm"
        >
          Agendar
        </button>
      </div>
    </header>
  );
}

export default Header;