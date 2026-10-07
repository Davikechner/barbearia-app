import { useState, useMemo } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAgendamento } from '../../../context/AgendamentoContext';

const HORARIOS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
];

// FAKE — depois vira API. Formato: { barbeiro: ['HH:MM', ...] }
const OCUPADOS_FAKE = {
  Kauan: ['09:00', '11:30', '14:00', '16:30'],
  Guilherme: ['10:00', '13:30', '15:00', '17:30'],
};

function Horario() {
  const navigate = useNavigate();
  const { agendamento, atualizar } = useAgendamento();
  const [data, setData] = useState(agendamento.data || '');
  const [horario, setHorario] = useState(agendamento.horario || '');

  if (!agendamento.servico || !agendamento.barbeiro) {
    navigate('/agendar/servico');
    return null;
  }

  const hoje = new Date().toISOString().split('T')[0];

  const ocupados = useMemo(() => {
    return new Set(OCUPADOS_FAKE[agendamento.barbeiro] || []);
  }, [agendamento.barbeiro]);

  const continuar = () => {
    if (!data || !horario) return;
    atualizar({ data, horario });
    navigate('/agendar/confirmar');
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 antialiased flex justify-center min-h-screen">
      <div className="w-full max-w-md bg-zinc-900 min-h-screen shadow-2xl relative flex flex-col border-x border-zinc-800">
        <header className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900 sticky top-0 z-40">
          <button
            onClick={() => navigate('/agendar/barbeiro')}
            className="text-zinc-400 hover:text-white p-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-sm text-white">Novo Agendamento</h1>
            <p className="text-[11px] text-zinc-400">
              Passo 3 de 4: Data e horário
            </p>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-5 overflow-y-auto">
          {/* Resumo pequeno do que foi escolhido */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-500">Serviço</span>
              <span className="text-zinc-200 font-medium">
                {agendamento.servico.nome}
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-500">Barbeiro</span>
              <span className="text-zinc-200 font-medium">
                {agendamento.barbeiro}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-2">
              <CalendarIcon className="w-3.5 h-3.5 text-yellow-500" />
              Selecione a Data
            </label>
            <input
              type="date"
              value={data}
              min={hoje}
              onChange={(e) => {
                setData(e.target.value);
                setHorario('');
              }}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500 [color-scheme:dark]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-yellow-500" />
                Horários Disponíveis
              </label>
              <span className="text-[10px] text-zinc-500">
                {ocupados.size > 0 ? `${ocupados.size} ocupados` : 'Todos livres'}
              </span>
            </div>

            {!data && (
              <div className="flex items-start gap-2 bg-zinc-800/40 border border-zinc-800 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-400">
                  Escolha uma data primeiro para ver os horários.
                </p>
              </div>
            )}

            {data && (
              <div className="grid grid-cols-4 gap-2">
                {HORARIOS.map((h) => {
                  const bloqueado = ocupados.has(h);
                  const selecionado = horario === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={bloqueado}
                      onClick={() => setHorario(h)}
                      className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                        bloqueado
                          ? 'bg-zinc-950/40 border-zinc-900 text-zinc-700 line-through cursor-not-allowed'
                          : selecionado
                          ? 'bg-yellow-500 text-zinc-950 border-yellow-500 shadow-md shadow-yellow-500/20'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:border-yellow-500'
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        <footer className="p-4 border-t border-zinc-800 bg-zinc-900">
          <button
            onClick={continuar}
            disabled={!data || !horario}
            className={`w-full font-bold py-3 rounded-xl text-sm transition-all ${
              data && horario
                ? 'bg-yellow-500 hover:bg-yellow-600 text-zinc-950'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            Continuar
          </button>
        </footer>
      </div>
    </div>
  );
}

export default Horario;