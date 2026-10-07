import { DollarSign, Calendar, CheckCircle2, Banknote, CreditCard } from 'lucide-react';

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Faturamento total */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Faturamento — {barbeiro}
          </span>
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-yellow-400 tracking-tight">
            R$ {totalConcluido.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-400">Total concluído hoje</p>
      </div>

      {/* Dinheiro */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Em Dinheiro
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Banknote className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
            R$ {dinheiro.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-400">Para conferir na gaveta</p>
      </div>

      {/* Pix/Cartão */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Pix / Cartão
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 tracking-tight">
            R$ {digital.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-400">Pix + Cartão</p>
      </div>

      {/* Pendentes / Concluídos */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Atendimentos
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-3 flex-wrap">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-white">
              {pendentes.length}
            </span>
            <span className="text-xs text-zinc-500">pendentes</span>
          </div>
          <span className="text-zinc-700">•</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-emerald-400">
              {concluidos.length}
            </span>
            <span className="text-xs text-zinc-500">feitos</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-zinc-400">Hoje</p>
      </div>
    </div>
  );
}

export default MetricasBar;