import { useState } from 'react';
import { X, Plus, ShoppingCart, Check } from 'lucide-react';

const PRODUTOS = [
  { id: 'bananinha', nome: 'Bananinha Frita', preco: 5.0 },
  { id: 'refri', nome: 'Refrigerante Lata', preco: 6.0 },
  { id: 'energetico', nome: 'Energético', preco: 12.0 },
  { id: 'agua', nome: 'Água', preco: 3.0 },
  { id: 'cerveja', nome: 'Cerveja', preco: 8.0 },
];

function ModalConsumo({ aberto, agendamento, onFechar, onSalvar }) {
  const [selecionados, setSelecionados] = useState(agendamento?.consumo || []);

  if (!aberto || !agendamento) return null;

  const adicionar = (produto) => {
    setSelecionados((prev) => [...prev, produto]);
  };

  const remover = (index) => {
    setSelecionados((prev) => prev.filter((_, i) => i !== index));
  };

  const totalConsumo = selecionados.reduce((acc, p) => acc + p.preco, 0);

  const confirmar = () => {
    onSalvar(selecionados);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                Consumo do Cliente
              </h3>
              <p className="text-xs text-zinc-400">{agendamento.clienteNome}</p>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Produtos */}
        <div className="p-5 overflow-y-auto flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
            Adicionar produtos
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {PRODUTOS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => adicionar(p)}
                className="group flex items-center justify-between gap-2 p-3 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-yellow-500/60 hover:bg-zinc-900 transition-all text-left"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-100 truncate">
                    {p.nome}
                  </p>
                  <p className="text-xs text-yellow-400 font-semibold">
                    R$ {p.preco.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-zinc-800 group-hover:bg-yellow-500 flex items-center justify-center text-zinc-400 group-hover:text-zinc-950 transition-all shrink-0">
                  <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
              </button>
            ))}
          </div>

          {selecionados.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                Adicionados ({selecionados.length})
              </p>
              <div className="space-y-2">
                {selecionados.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2"
                  >
                    <span className="text-sm text-zinc-200">{p.nome}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-yellow-400">
                        R$ {p.preco.toFixed(2).replace('.', ',')}
                      </span>
                      <button
                        type="button"
                        onClick={() => remover(i)}
                        className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Total do consumo:</span>
            <span className="text-lg font-bold text-yellow-400">
              R$ {totalConsumo.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onFechar}
              className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmar}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-zinc-950 text-sm font-semibold transition-all shadow-lg shadow-yellow-500/20"
            >
              <Check className="w-4 h-4" />
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalConsumo;