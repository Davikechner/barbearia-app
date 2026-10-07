import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function isoDataLocal(ano, mes, dia) {
  const m = String(mes + 1).padStart(2, '0');
  const d = String(dia).padStart(2, '0');
  return `${ano}-${m}-${d}`;
}

function hojeISO() {
  const h = new Date();
  return isoDataLocal(h.getFullYear(), h.getMonth(), h.getDate());
}

function SeletorData({ valor, onChange }) {
  const hoje = new Date();
  const hojeStr = hojeISO();

  // Mês que está sendo exibido
  const dataInicial = valor
    ? new Date(valor + 'T12:00:00')
    : new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const [mesVisivel, setMesVisivel] = useState(dataInicial.getMonth());
  const [anoVisivel, setAnoVisivel] = useState(dataInicial.getFullYear());

  const primeiroDiaSemana = new Date(anoVisivel, mesVisivel, 1).getDay();
  const diasNoMes = new Date(anoVisivel, mesVisivel + 1, 0).getDate();

  const podeVoltar = (() => {
    const mesAtual = new Date(anoVisivel, mesVisivel, 1);
    const mesHoje = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    return mesAtual > mesHoje;
  })();

  const podeAvancar = true; // pode ir pro futuro

  const irMesAnterior = () => {
    if (!podeVoltar) return;
    if (mesVisivel === 0) {
      setMesVisivel(11);
      setAnoVisivel(anoVisivel - 1);
    } else {
      setMesVisivel(mesVisivel - 1);
    }
  };

  const irProximoMes = () => {
    if (mesVisivel === 11) {
      setMesVisivel(0);
      setAnoVisivel(anoVisivel + 1);
    } else {
      setMesVisivel(mesVisivel + 1);
    }
  };

  const escolherDia = (dia) => {
    onChange(isoDataLocal(anoVisivel, mesVisivel, dia));
  };

  // Monta os dias (com espaços em branco no começo)
  const celulas = [];
  for (let i = 0; i < primeiroDiaSemana; i++) celulas.push(null);
  for (let d = 1; d <= diasNoMes; d++) celulas.push(d);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
      {/* Cabeçalho do mês */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={irMesAnterior}
          disabled={!podeVoltar}
          className={`p-2 rounded-lg transition-all ${
            podeVoltar
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              : 'text-zinc-700 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-sm font-bold text-white">
          {MESES[mesVisivel]}{' '}
          <span className="text-zinc-400 font-medium">{anoVisivel}</span>
        </div>
        <button
          type="button"
          onClick={irProximoMes}
          disabled={!podeAvancar}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DIAS_SEMANA.map((d, i) => (
          <div
            key={i}
            className="text-center text-[10px] font-bold text-zinc-500 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-7 gap-1">
        {celulas.map((dia, i) => {
          if (dia === null) {
            return <div key={`vazio-${i}`} />;
          }

          const isoDia = isoDataLocal(anoVisivel, mesVisivel, dia);
          const ehHoje = isoDia === hojeStr;
          const ehPassado = isoDia < hojeStr;
          const ehDomingo = new Date(anoVisivel, mesVisivel, dia).getDay() === 0;
          const bloqueado = ehPassado || ehDomingo;
          const selecionado = valor === isoDia;

          return (
            <button
              key={isoDia}
              type="button"
              disabled={bloqueado}
              onClick={() => escolherDia(dia)}
              title={ehDomingo ? 'Fechado aos domingos' : undefined}
              className={`aspect-square rounded-lg text-sm font-semibold transition-all flex items-center justify-center relative ${
                bloqueado
                  ? 'text-zinc-700 cursor-not-allowed line-through decoration-zinc-800'
                  : selecionado
                  ? 'bg-yellow-500 text-zinc-950 shadow-md shadow-yellow-500/20'
                  : 'text-zinc-200 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {dia}
              {ehHoje && !selecionado && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-yellow-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Rodapé com atalhos */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
        <button
          type="button"
          onClick={() => {
            const h = new Date();
            setMesVisivel(h.getMonth());
            setAnoVisivel(h.getFullYear());
            onChange(hojeStr);
          }}
          className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold"
        >
          Hoje
        </button>
        {valor && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}

export default SeletorData;