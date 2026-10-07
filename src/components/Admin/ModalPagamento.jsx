import { X, Banknote, CreditCard, Zap, Check } from 'lucide-react';

const FORMAS = [
  {
    id: 'pix',
    nome: 'Pix',
    desc: 'Cai na hora',
    Icone: Zap,
    cor: 'text-purple-400',
    bgCor: 'bg-purple-500/10',
    corBorda: 'hover:border-purple-500',
  },
  {
    id: 'dinheiro',
    nome: 'Dinheiro',
    desc: 'Direto na gaveta',
    Icone: Banknote,
    cor: 'text-emerald-400',
    bgCor: 'bg-emerald-500/10',
    corBorda: 'hover:border-emerald-500',
  },
  {
    id: 'cartao',
    nome: 'Cartão',
    desc: 'Débito ou crédito',
    Icone: CreditCard,
    cor: 'text-blue-400',
    bgCor: 'bg-blue-500/10',
    corBorda: 'hover:border-blue-500',
  },
];

function ModalPagamento({ aberto, agendamento, onFechar, onConfirmar }) {
  if (!aberto || !agendamento) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full shadow-2xl relative">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-100">
              Finalizar Atendimento
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {agendamento.clienteNome} — R${' '}
              {agendamento.preco.toFixed(2).replace('.', ',')}
            </p>
          </div>
          <button
            onClick={onFechar}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
            Forma de pagamento
          </p>
          <div className="space-y-2">
            {FORMAS.map((f) => (
              <button
                key={f.id}
                onClick={() => onConfirmar(f.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950 ${f.corBorda} transition-all text-left group`}
              >
                <div
                  className={`w-11 h-11 rounded-xl ${f.bgCor} ${f.cor} flex items-center justify-center shrink-0`}
                >
                  <f.Icone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-zinc-100">{f.nome}</p>
                  <p className="text-xs text-zinc-500">{f.desc}</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-zinc-800 group-hover:bg-yellow-500 flex items-center justify-center text-zinc-400 group-hover:text-zinc-950 transition-all">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalPagamento;