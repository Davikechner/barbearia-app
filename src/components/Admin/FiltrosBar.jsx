import { Clock, CheckCircle2, Search } from 'lucide-react';

function FiltrosBar({
  abaAtual,
  onTrocarAba,
  busca,
  onBuscaChange,
  filtroBarbeiro,
  onFiltroBarbeiroChange,
  contadores,
}) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800">
      {/* Abas */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onTrocarAba('pending')}
          className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            abaAtual === 'pending'
              ? 'bg-yellow-500 text-zinc-950 shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pendentes ({contadores.pendentes})</span>
        </button>
        <button
          onClick={() => onTrocarAba('completed')}
          className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            abaAtual === 'completed'
              ? 'bg-yellow-500 text-zinc-950 shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Concluídos ({contadores.concluidos})</span>
        </button>
      </div>

      {/* Busca + filtro */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 lg:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            placeholder="Buscar cliente ou serviço..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-500 transition-all"
          />
        </div>
        <select
          value={filtroBarbeiro}
          onChange={(e) => onFiltroBarbeiroChange(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-yellow-500"
        >
          <option value="all">Todos Barbeiros</option>
          <option value="Kauan">Kauan</option>
          <option value="Guilherme">Guilherme</option>
        </select>
      </div>
    </div>
  );
}

export default FiltrosBar;