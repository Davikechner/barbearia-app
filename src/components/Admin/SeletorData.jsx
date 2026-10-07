import { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
} from 'lucide-react';
import SeletorDataVisual from '../Cliente/SeletorData';

function somarDias(iso, dias) {
  const [ano, mes, dia] = iso.split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);
  d.setDate(d.getDate() + dias);
  const a = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${a}-${m}-${dd}`;
}

function rotuloData(dataISO, hojeISO) {
  if (dataISO === hojeISO) return 'Hoje';
  if (dataISO === somarDias(hojeISO, -1)) return 'Ontem';
  if (dataISO === somarDias(hojeISO, 1)) return 'Amanhã';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

function SeletorData({ dataSelecionada, hojeISO, onChange }) {
  const [popoverAberto, setPopoverAberto] = useState(false);
  const ref = useRef(null);

  const ontem = somarDias(hojeISO, -1);
  const amanha = somarDias(hojeISO, 1);

  const atalhos = [
    { label: 'Ontem', data: ontem },
    { label: 'Hoje', data: hojeISO },
    { label: 'Amanhã', data: amanha },
  ];

  useEffect(() => {
    if (!popoverAberto) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setPopoverAberto(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [popoverAberto]);

  useEffect(() => {
    if (!popoverAberto) return;
    const handler = (e) => {
      if (e.key === 'Escape') setPopoverAberto(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [popoverAberto]);

  const escolherDataVisual = (novaData) => {
    if (!novaData) return;
    onChange(novaData);
    setPopoverAberto(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 shrink-0">
          <CalendarIcon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Visualizando
          </p>
          <p className="text-sm font-bold text-white truncate">
            {rotuloData(dataSelecionada, hojeISO)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onChange(somarDias(dataSelecionada, -1))}
          className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
          title="Dia anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-xl p-1">
          {atalhos.map((a) => (
            <button
              key={a.label}
              onClick={() => onChange(a.data)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dataSelecionada === a.data
                  ? 'bg-yellow-500 text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => onChange(somarDias(dataSelecionada, 1))}
          className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
          title="Próximo dia"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setPopoverAberto((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
              popoverAberto
                ? 'bg-yellow-500 text-zinc-950 border-yellow-500'
                : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-yellow-500/50 hover:text-white'
            }`}
            title="Escolher data específica"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Escolher data</span>
          </button>

          {popoverAberto && (
            <div className="absolute right-0 mt-2 z-50 w-72 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="relative">
                <button
                  onClick={() => setPopoverAberto(false)}
                  className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 flex items-center justify-center shadow-lg transition-colors"
                  title="Fechar"
                >
                  <X className="w-3 h-3" />
                </button>
                <SeletorDataVisual
                  valor={dataSelecionada}
                  onChange={escolherDataVisual}
                  modo="navegar"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SeletorData;