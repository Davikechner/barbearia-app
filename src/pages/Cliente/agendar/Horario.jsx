import { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  Loader2,
  Lock,
  History,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAgendamento } from '../../../context/AgendamentoContext';
import { listarHorariosOcupados } from '../../../api';
import SeletorData from '../../../components/Cliente/SeletorData';

const HORARIOS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
];

function paraMinutos(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function dataLocalISO(d = new Date()) {
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function Horario() {
  const navigate = useNavigate();
  const { agendamento, atualizar } = useAgendamento();
  const [data, setData] = useState(agendamento.data || '');
  const [horario, setHorario] = useState(agendamento.horario || '');
  const [ocupados, setOcupados] = useState(new Set());
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const [agoraMinutos, setAgoraMinutos] = useState(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });

  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setAgoraMinutos(d.getHours() * 60 + d.getMinutes());
    }, 30 * 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!data || !agendamento.barbeiro) {
      setOcupados(new Set());
      return;
    }

    let cancelado = false;
    const buscar = async () => {
      try {
        setCarregando(true);
        setErro(null);
        const resp = await listarHorariosOcupados(agendamento.barbeiro, data);
        if (!cancelado) {
          const set = new Set((resp.ocupados || []).map((h) => h.slice(0, 5)));
          setOcupados(set);
        }
      } catch (e) {
        console.error(e);
        if (!cancelado) setErro('Não foi possível buscar os horários.');
      } finally {
        if (!cancelado) setCarregando(false);
      }
    };

    buscar();
    return () => {
      cancelado = true;
    };
  }, [data, agendamento.barbeiro]);

  if (!agendamento.servico || !agendamento.barbeiro) {
    navigate('/agendar/servico');
    return null;
  }

  const hoje = dataLocalISO();

  const horariosPassados = useMemo(() => {
    const passados = new Set();
    if (data === hoje) {
      HORARIOS.forEach((h) => {
        if (paraMinutos(h) < agoraMinutos) passados.add(h);
      });
    }
    return passados;
  }, [data, hoje, agoraMinutos]);

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
            <p className="text-[11px] text-zinc-400">Passo 3 de 4: Data e horário</p>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-5 overflow-y-auto">
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-500">Serviço</span>
              <span className="text-zinc-200 font-medium">{agendamento.servico.nome}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-500">Barbeiro</span>
              <span className="text-zinc-200 font-medium">{agendamento.barbeiro}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-3 block">
              Selecione a Data
            </label>
            <SeletorData valor={data} onChange={(novaData) => {
              setData(novaData);
              setHorario('');
            }} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-yellow-500" />
                Horários Disponíveis
              </label>
              {data && !carregando && (
                <span className="text-[10px] text-zinc-500">
                  {ocupados.size > 0 ? `${ocupados.size} ocupados` : 'Todos livres'}
                </span>
              )}
            </div>

            {!data && (
              <div className="flex items-start gap-2 bg-zinc-800/40 border border-zinc-800 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-400">
                  Escolha uma data primeiro para ver os horários.
                </p>
              </div>
            )}

            {data && carregando && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
              </div>
            )}

            {data && erro && (
              <div className="flex items-start gap-2 bg-red-950/30 border border-red-900/40 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{erro}</p>
              </div>
            )}

            {data && !carregando && !erro && (
              <div className="grid grid-cols-4 gap-2">
                {HORARIOS.map((h) => {
                  const bloqueado = ocupados.has(h);
                  const passou = horariosPassados.has(h);
                  const indisponivel = bloqueado || passou;
                  const selecionado = horario === h;

                  let tooltip = `Agendar às ${h}`;
                  if (bloqueado) tooltip = 'Horário já reservado';
                  else if (passou) tooltip = 'Horário já passou';

                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={indisponivel}
                      onClick={() => setHorario(h)}
                      title={tooltip}
                      className={`relative py-2.5 text-xs font-semibold rounded-xl border transition-all flex flex-col items-center justify-center gap-0.5 ${
                        indisponivel
                          ? 'bg-zinc-950/60 border-zinc-800/60 text-zinc-600 cursor-not-allowed'
                          : selecionado
                          ? 'bg-yellow-500 text-zinc-950 border-yellow-500 shadow-md shadow-yellow-500/20'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:border-yellow-500'
                      }`}
                    >
                      {bloqueado && <Lock className="w-2.5 h-2.5 text-zinc-600" />}
                      {passou && !bloqueado && (
                        <History className="w-2.5 h-2.5 text-zinc-600" />
                      )}
                      <span className={indisponivel ? 'line-through decoration-zinc-600' : ''}>
                        {h}
                      </span>
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