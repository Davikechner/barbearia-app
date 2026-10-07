import {
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Scissors,
  User,
  Phone,
  Check,
  Trash2,
  RotateCcw,
  ShoppingCart,
  Banknote,
  CreditCard,
  Plus,
} from 'lucide-react';

const COR_BARBEIRO = {
  Kauan: {
    texto: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    borda: 'border-yellow-500/30',
  },
  Guilherme: {
    texto: 'text-blue-400',
    bg: 'bg-blue-500/10',
    borda: 'border-blue-500/30',
  },
};

const INFO_PAGAMENTO = {
  pix: { nome: 'Pix', Icone: Zap, cor: 'text-purple-400', bg: 'bg-purple-500/10' },
  dinheiro: { nome: 'Dinheiro', Icone: Banknote, cor: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  cartao: { nome: 'Cartão', Icone: CreditCard, cor: 'text-blue-400', bg: 'bg-blue-500/10' },
};

function CardAgendamento({
  agendamento,
  ehProximo,
  ehAtrasado,
  onConcluir,
  onCancelar,
  onReverter,
  onAdicionarConsumo,
}) {
  const {
    id,
    clienteNome,
    telefone,
    servico,
    preco,
    barbeiro,
    horario,
    status,
    consumo = [],
    pagamento,
  } = agendamento;

  const cores = COR_BARBEIRO[barbeiro] || COR_BARBEIRO.Kauan;
  const totalConsumo = consumo.reduce((acc, p) => acc + p.preco, 0);

  const atrasadoPendente = ehAtrasado && status === 'pending';

  let classesCard = 'border-zinc-800 hover:border-zinc-700';
  if (ehProximo) {
    classesCard =
      'border-yellow-500/80 bg-gradient-to-r from-yellow-500/10 via-zinc-900 to-zinc-900 shadow-lg shadow-yellow-500/10';
  } else if (atrasadoPendente) {
    // Vermelho bem opaco, discreto
    classesCard = 'border-red-900/40 bg-red-950/10 hover:border-red-800/60';
  }

  return (
    <div
      className={`bg-zinc-900/90 border rounded-2xl p-4 sm:p-5 transition-all relative overflow-hidden ${classesCard}`}
    >
      {/* Badge flutuante */}
      {ehProximo && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-500 text-zinc-950 shadow">
            <Zap className="w-3 h-3 fill-current" />
            PRÓXIMO
          </span>
        </div>
      )}
      {atrasadoPendente && !ehProximo && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-red-950/60 text-red-400/70 border border-red-900/50">
            <AlertCircle className="w-3 h-3" />
            ATRASADO
          </span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4 w-full lg:w-auto flex-1 min-w-0">
          {/* Horário */}
          <div
            className={`w-16 h-16 rounded-2xl border flex flex-col items-center justify-center shrink-0 ${
              atrasadoPendente
                ? 'bg-red-950/30 border-red-900/40'
                : 'bg-zinc-800 border-zinc-700/60'
            }`}
          >
            <span
              className={`text-sm font-bold ${
                atrasadoPendente ? 'text-red-300/70' : 'text-yellow-400'
              }`}
            >
              {horario}
            </span>
            <span className="text-[10px] text-zinc-500 font-medium uppercase">
              Hoje
            </span>
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                className={`text-base font-bold truncate ${
                  atrasadoPendente ? 'text-zinc-300' : 'text-zinc-100'
                }`}
              >
                {clienteNome}
              </h4>
              {status === 'completed' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Concluído
                </span>
              )}
              {status === 'pending' && !ehProximo && !ehAtrasado && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-300">
                  <Clock className="w-3 h-3 text-yellow-400" />
                  Agendado
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs flex-wrap">
              <span
                className={`flex items-center gap-1 font-medium ${
                  atrasadoPendente ? 'text-yellow-300/70' : 'text-yellow-300'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>{servico}</span>
              </span>
              <span
                className={`flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-full border ${
                  atrasadoPendente
                    ? 'text-zinc-400 bg-zinc-800/60 border-zinc-700'
                    : `${cores.texto} ${cores.bg} ${cores.borda}`
                }`}
              >
                <User className="w-3 h-3" />
                <span>{barbeiro}</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-500 flex-wrap">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{telefone || 'Sem telefone'}</span>
              </span>
              <span>•</span>
              <span
                className={`font-bold ${
                  atrasadoPendente ? 'text-emerald-400/70' : 'text-emerald-400'
                }`}
              >
                R$ {preco.toFixed(2).replace('.', ',')}
              </span>
              {totalConsumo > 0 && (
                <span className="text-zinc-500 text-[10px]">
                  (serviço + R$ {totalConsumo.toFixed(2).replace('.', ',')} consumo)
                </span>
              )}
            </div>

            {consumo.length > 0 && (
              <div className="flex items-center gap-2 text-xs pt-0.5 flex-wrap">
                <span className="flex items-center gap-1 text-yellow-400/80">
                  <ShoppingCart className="w-3 h-3" />
                  <span className="font-semibold">Consumo:</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {consumo.map((p, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-500/10 text-yellow-300 border border-yellow-500/20"
                    >
                      {p.nome}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {status === 'completed' && pagamento && (
              <div className="flex items-center gap-2 text-xs pt-0.5">
                {(() => {
                  const info = INFO_PAGAMENTO[pagamento];
                  if (!info) return null;
                  return (
                    <span
                      className={`flex items-center gap-1.5 ${info.cor} ${info.bg} px-2 py-0.5 rounded-full font-medium`}
                    >
                      <info.Icone className="w-3 h-3" />
                      Pago em {info.nome}
                    </span>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-zinc-800 flex-wrap">
          {status === 'pending' ? (
            <>
              <button
                onClick={() => onAdicionarConsumo(agendamento)}
                className="flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-yellow-400 px-3 py-2 rounded-xl text-xs font-semibold border border-zinc-700 transition-all"
                title="Adicionar consumo"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Consumo</span>
              </button>
              <button
                onClick={() => onConcluir(agendamento)}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all ${
                  atrasadoPendente
                    ? 'bg-emerald-700/70 hover:bg-emerald-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Concluir</span>
              </button>
              <button
                onClick={() => onCancelar(id)}
                className="flex items-center justify-center p-2 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-zinc-700 transition-all"
                title="Cancelar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => onReverter(id)}
              className="flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tornar Pendente</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardAgendamento;