import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

function paraMinutos(hhmm) {
  if (!hhmm) return 0;
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

// Soma N dias numa data ISO 'YYYY-MM-DD'
function somarDias(iso, dias) {
  const [ano, mes, dia] = iso.split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);
  d.setDate(d.getDate() + dias);
  const a = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${a}-${m}-${dd}`;
}

// Rótulo amigável pra data
function rotuloData(dataISO, hojeISO) {
  if (dataISO === hojeISO) return 'Hoje';
  if (dataISO === somarDias(hojeISO, -1)) return 'Ontem';
  if (dataISO === somarDias(hojeISO, 1)) return 'Amanhã';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

function SeletorData({ dataSelecionada, hojeISO, onChange }) {
  const ontem = somarDias(hojeISO, -1);
  const amanha = somarDias(hojeISO, 1);

  const atalhos = [
    { label: 'Ontem', data: ontem },
    { label: 'Hoje', data: hojeISO },
    { label: 'Amanhã', data: amanha },
  ];

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

        <input
          type="date"
          value={dataSelecionada}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-yellow-500 [color-scheme:dark]"
        />
      </div>
    </div>
  );
}

export default SeletorData;