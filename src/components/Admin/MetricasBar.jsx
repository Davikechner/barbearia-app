import { DollarSign, Calendar, Banknote, CreditCard } from 'lucide-react';

function MetricasBar({ agendamentos, barbeiro }) {
  const meus = agendamentos.filter((a) => a.barbeiro === barbeiro);

  const concluidos = meus.filter((a) => a.status === 'completed');
  const pendentes = meus.filter((a) => a.status === 'pending');

  const totalConcluido = concluidos.reduce((acc, a) => acc + a.preco, 0);

  const dinheiro = concluidos
    .filter((a) => a.pagamento === 'dinheiro')
    .reduce((acc, a) => acc + a.preco, 0);

  const digital = concluidos
    .filter((a) => a.pagamento === 'pix' || a.pagamento === 'cartao')
    .reduce((acc, a) => acc + a.preco, 0);

  const formatar = (valor) => `R$ ${valor.toFixed(2).replace('.', ',')}`;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Faturamento total */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-3 sm:p-5 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400 leading-tight">
            Faturamento
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 shrink-0">
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <span className="text-lg sm:text-3xl font-extrabold text-yellow-400 tracking-tight block leading-tight">
            {formatar(totalConcluido)}
          </span>
        </div>
        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-zinc-500 leading-tight">
          {barbeiro} · hoje
        </p>
      </div>

      {/* Dinheiro */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-3 sm:p-5 relative overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400 leading-tight">
            Dinheiro
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <span className="text-lg sm:text-3xl font-extrabold text-emerald-400 tracking-tight block leading-tight">
            {formatar(dinheiro)}
          </span>
        </div>
        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-zinc-500 leading-tight">
          Na gaveta
        </p>
      </div>

      {/* Pix/Cartão */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-3 sm:p-5 relative overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400 leading-tight">
            Pix / Cartão
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <span className="text-lg sm:text-3xl font-extrabold text-blue-400 tracking-tight block leading-tight">
            {formatar(digital)}
          </span>
        </div>
        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-zinc-500 leading-tight">
          Pix + Cartão
        </p>
      </div>

      {/* Atendimentos */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-3 sm:p-5 relative overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400 leading-tight">
            Atendimentos
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3 flex items-baseline gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-baseline gap-1">
            <span className="text-lg sm:text-3xl font-extrabold text-white leading-tight">
              {pendentes.length}
            </span>
            <span className="text-[10px] sm:text-xs text-zinc-500">
              pend.
            </span>
          </div>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg sm:text-3xl font-extrabold text-emerald-400 leading-tight">
              {concluidos.length}
            </span>
            <span className="text-[10px] sm:text-xs text-zinc-500">
              feitos
            </span>
          </div>
        </div>
        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-zinc-500 leading-tight">
          Hoje
        </p>
      </div>
    </div>
  );
}

export default MetricasBar;