import { useState, useMemo, useEffect } from 'react';
import {
  UserPlus,
  X,
  User,
  Sparkles,
  Flame,
  Eye,
  Scissors,
  Clock,
  Check,
  Phone,
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  Lock,
  History,
  Loader2,
} from 'lucide-react';
import { useBarbeiro } from '../../context/BarbeiroContext';
import { listarHorariosOcupados } from '../../api';
import SeletorData from '../Cliente/SeletorData';

const SERVICOS = [
  { id: 'degrade', nome: 'Corte Degradê', preco: 45, Icone: Scissors, desc: 'Máquina + tesoura' },
  { id: 'barba', nome: 'Barba Terapia', preco: 35, Icone: Sparkles, desc: 'Toalha quente e navalha' },
  { id: 'combo', nome: 'Corte + Barba', preco: 70, Icone: Flame, desc: 'Combo completo' },
  { id: 'sobrancelha', nome: 'Sobrancelha', preco: 20, Icone: Eye, desc: 'Alinhamento perfeito' },
  { id: 'pezinho', nome: 'Pezinho / Acabamento', preco: 25, Icone: Scissors, desc: 'Manutenção rápida' },
];

const BARBEIROS = [
  { nome: 'Kauan', desc: 'Degradê e Barba', letra: 'K' },
  { nome: 'Guilherme', desc: 'Clássicos e Tesoura', letra: 'G' },
];

const HORARIOS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
];

const CORES_BARBEIRO = {
  Kauan: {
    ativo: 'bg-yellow-500/20 border-yellow-500',
    avatarAtivo: 'bg-yellow-500 text-zinc-950',
    avatarInativo: 'bg-yellow-500/10 text-yellow-400',
  },
  Guilherme: {
    ativo: 'bg-blue-500/20 border-blue-500',
    avatarAtivo: 'bg-blue-500 text-white',
    avatarInativo: 'bg-blue-500/10 text-blue-400',
  },
};

const TITULOS = [
  'Escolha o serviço',
  'Escolha o barbeiro',
  'Data e horário',
  'Confirme os dados',
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

function ModalNovoAgendamento({ aberto, onFechar, onSalvar, agendamentos = [], dataInicial }) {
  const { barbeiroLogado } = useBarbeiro();
  const hojeISO = dataLocalISO();
  const [etapa, setEtapa] = useState(1);

  const [servicoSelecionado, setServicoSelecionado] = useState(SERVICOS[0]);
  const [barbeiro, setBarbeiro] = useState(barbeiroLogado);
  const [data, setData] = useState(dataInicial || hojeISO);
  const [horario, setHorario] = useState('');
  const [clienteNome, setClienteNome] = useState('');
  const [telefone, setTelefone] = useState('');

  const [ocupados, setOcupados] = useState(new Set());
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);

  const [agoraMinutos, setAgoraMinutos] = useState(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });

  // Reset ao abrir
  useEffect(() => {
    if (aberto) {
      setEtapa(1);
      setServicoSelecionado(SERVICOS[0]);
      setBarbeiro(barbeiroLogado);
      setData(dataInicial || hojeISO);
      setHorario('');
      setClienteNome('');
      setTelefone('');
      const d = new Date();
      setAgoraMinutos(d.getHours() * 60 + d.getMinutes());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto, barbeiroLogado, dataInicial]);

  // Atualiza relógio
  useEffect(() => {
    if (!aberto) return;
    const t = setInterval(() => {
      const d = new Date();
      setAgoraMinutos(d.getHours() * 60 + d.getMinutes());
    }, 30 * 1000);
    return () => clearInterval(t);
  }, [aberto]);

  // Busca horários ocupados quando muda barbeiro ou data
  useEffect(() => {
    if (!aberto || !barbeiro || !data) return;
    let cancelado = false;

    const buscar = async () => {
      try {
        setCarregandoHorarios(true);
        const resp = await listarHorariosOcupados(barbeiro, data);
        if (!cancelado) {
          setOcupados(new Set((resp.ocupados || []).map((h) => h.slice(0, 5))));
        }
      } catch (e) {
        console.error('Erro ao buscar horários:', e);
        if (!cancelado) setOcupados(new Set());
      } finally {
        if (!cancelado) setCarregandoHorarios(false);
      }
    };

    buscar();
    return () => {
      cancelado = true;
    };
  }, [aberto, barbeiro, data]);

  // Limpa horário se ficar inválido
  useEffect(() => {
    if (!horario) return;
    const ehHoje = data === hojeISO;
    const passou = ehHoje && paraMinutos(horario) < agoraMinutos;
    if (ocupados.has(horario) || passou) {
      setHorario('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, barbeiro, ocupados]);

  const horariosPassados = useMemo(() => {
    const passados = new Set();
    if (data === hojeISO) {
      HORARIOS.forEach((h) => {
        if (paraMinutos(h) < agoraMinutos) passados.add(h);
      });
    }
    return passados;
  }, [data, hojeISO, agoraMinutos]);

  if (!aberto) return null;

  const podeAvancar = () => {
    if (etapa === 1) return !!servicoSelecionado;
    if (etapa === 2) return !!barbeiro;
    if (etapa === 3) return !!horario && !!data;
    return clienteNome.trim().length > 0;
  };

  const avancar = () => {
    if (podeAvancar() && etapa < 4) setEtapa(etapa + 1);
  };

  const voltar = () => {
    if (etapa > 1) setEtapa(etapa - 1);
  };

  const salvar = () => {
    if (!clienteNome.trim() || !horario || !data) return;
    onSalvar({
      clienteNome: clienteNome.trim(),
      telefone: telefone.trim() || '(00) 00000-0000',
      barbeiro,
      servico: servicoSelecionado.nome,
      horario,
      data,
      preco: Number(servicoSelecionado.preco),
    });
  };

  const formatarPreco = (valor) =>
    `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;

  const formatarDataBR = (iso) => {
    if (!iso) return '';
    const [a, m, d] = iso.split('-');
    return `${d}/${m}/${a}`;
  };

  const rotuloData = data === hojeISO
    ? 'Hoje'
    : data === dataLocalISO(new Date(Date.now() + 86400000))
    ? 'Amanhã'
    : formatarDataBR(data);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full shadow-2xl relative my-4 sm:my-8 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-zinc-950 shadow-lg shadow-yellow-500/20">
              <UserPlus className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                Novo Agendamento Manual
              </h3>
              <p className="text-xs text-zinc-400">
                Passo {etapa} de 4 · {TITULOS[etapa - 1]}
              </p>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de progresso */}
        <div className="px-5 pt-4 shrink-0">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  n <= etapa ? 'bg-yellow-500' : 'bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* ETAPA 1: Serviço */}
          {etapa === 1 && (
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                <Scissors className="w-3.5 h-3.5 text-yellow-500" />
                Qual serviço?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SERVICOS.map((s) => {
                  const ativo = servicoSelecionado.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setServicoSelecionado(s)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                        ativo
                          ? 'border-yellow-500 bg-yellow-500/10 shadow-md shadow-yellow-500/10'
                          : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          ativo
                            ? 'bg-yellow-500 text-zinc-950'
                            : 'bg-zinc-800 text-yellow-400'
                        }`}
                      >
                        <s.Icone className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-100 leading-tight">
                          {s.nome}
                        </p>
                        <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">
                          {s.desc}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold shrink-0 self-start ${
                          ativo ? 'text-yellow-400' : 'text-zinc-400'
                        }`}
                      >
                        {formatarPreco(s.preco)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ETAPA 2: Barbeiro */}
          {etapa === 2 && (
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                <User className="w-3.5 h-3.5 text-yellow-500" />
                Com qual barbeiro?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BARBEIROS.map((b) => {
                  const ativo = barbeiro === b.nome;
                  const cores = CORES_BARBEIRO[b.nome];
                  return (
                    <button
                      key={b.nome}
                      type="button"
                      onClick={() => setBarbeiro(b.nome)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                        ativo
                          ? cores.ativo
                          : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 transition-all ${
                          ativo ? cores.avatarAtivo : cores.avatarInativo
                        }`}
                      >
                        {b.letra}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-100 truncate">
                          {b.nome}
                        </p>
                        <p className="text-[11px] text-zinc-500 truncate">
                          {b.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 bg-zinc-950/60 border border-zinc-800 rounded-xl p-3">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Serviço escolhido</span>
                  <span className="text-zinc-200 font-medium">
                    {servicoSelecionado.nome}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 3: Data + Horário */}
          {etapa === 3 && (
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                  <CalendarIcon className="w-3.5 h-3.5 text-yellow-500" />
                  Escolha a data
                </label>
                <SeletorData valor={data} onChange={(novaData) => {
                  setData(novaData);
                  setHorario('');
                }} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-yellow-500" />
                    Horário com {barbeiro}
                  </label>
                  {!carregandoHorarios && (
                    <span className="text-[10px] text-zinc-500">
                      {ocupados.size > 0 ? `${ocupados.size} ocupados` : 'Todos livres'}
                    </span>
                  )}
                </div>

                {carregandoHorarios ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {HORARIOS.map((h) => {
                      const bloqueado = ocupados.has(h);
                      const passou = horariosPassados.has(h);
                      const indisponivel = bloqueado || passou;
                      const ativo = horario === h;
                      return (
                        <button
                          key={h}
                          type="button"
                          disabled={indisponivel}
                          onClick={() => setHorario(h)}
                          title={
                            bloqueado
                              ? 'Horário já reservado'
                              : passou
                              ? 'Horário já passou'
                              : `Agendar às ${h}`
                          }
                          className={`relative py-2.5 text-xs font-semibold rounded-xl border transition-all flex flex-col items-center justify-center gap-0.5 ${
                            indisponivel
                              ? 'bg-zinc-950/60 border-zinc-800/60 text-zinc-600 cursor-not-allowed'
                              : ativo
                              ? 'bg-yellow-500 text-zinc-950 border-yellow-500 shadow-md shadow-yellow-500/20'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-yellow-500/50 hover:text-white'
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

              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Serviço</span>
                  <span className="text-zinc-200 font-medium">
                    {servicoSelecionado.nome}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Barbeiro</span>
                  <span className="text-zinc-200 font-medium">{barbeiro}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Data</span>
                  <span className="text-yellow-400 font-medium">{rotuloData}</span>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 4: Dados e confirmação */}
          {etapa === 4 && (
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                  <User className="w-3.5 h-3.5 text-yellow-500" />
                  Dados do cliente
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={clienteNome}
                      onChange={(e) => setClienteNome(e.target.value)}
                      placeholder="Nome do cliente"
                      autoFocus
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="Telefone / WhatsApp (opcional)"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                  <Check className="w-3.5 h-3.5 text-yellow-500" />
                  Confira os dados
                </label>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Scissors className="w-3.5 h-3.5 text-yellow-500" />
                      <span>Serviço</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-100">
                      {servicoSelecionado.nome}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <User className="w-3.5 h-3.5 text-yellow-500" />
                      <span>Barbeiro</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-100">
                      {barbeiro}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <CalendarIcon className="w-3.5 h-3.5 text-yellow-500" />
                      <span>Data</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-100">
                      {rotuloData}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Clock className="w-3.5 h-3.5 text-yellow-500" />
                      <span>Horário</span>
                    </div>
                    <span className="text-sm font-semibold text-yellow-400">
                      {horario}
                    </span>
                  </div>
                  <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-400">
                      Total
                    </span>
                    <span className="text-base font-bold text-yellow-400">
                      {formatarPreco(servicoSelecionado.preco)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-zinc-800 shrink-0 flex gap-3">
          {etapa > 1 ? (
            <button
              type="button"
              onClick={voltar}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          ) : (
            <button
              type="button"
              onClick={onFechar}
              className="flex items-center justify-center px-4 py-3 rounded-xl border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
          )}

          {etapa < 4 ? (
            <button
              type="button"
              onClick={avancar}
              disabled={!podeAvancar()}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                podeAvancar()
                  ? 'bg-yellow-500 hover:bg-yellow-400 text-zinc-950 shadow-lg shadow-yellow-500/20'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={salvar}
              disabled={!podeAvancar()}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                podeAvancar()
                  ? 'bg-yellow-500 hover:bg-yellow-400 text-zinc-950 shadow-lg shadow-yellow-500/20'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" strokeWidth={3} />
              Salvar Agendamento
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalNovoAgendamento;