import { useState, useMemo, useEffect } from 'react';
import { CalendarOff, CheckCircle2, Moon, AlertCircle, Loader2 } from 'lucide-react';
import AdminHeader from '../../components/Admin/AdminHeader';
import MetricasBar from '../../components/Admin/MetricasBar';
import FiltrosBar from '../../components/Admin/FiltrosBar';
import SeletorData from '../../components/Admin/SeletorData';
import CardAgendamento from '../../components/Admin/CardAgendamento';
import ModalNovoAgendamento from '../../components/Admin/ModalNovoAgendamento';
import ModalPagamento from '../../components/Admin/ModalPagamento';
import ModalConsumo from '../../components/Admin/ModalConsumo';
import { useBarbeiro } from '../../context/BarbeiroContext';
import {
  listarAgendamentos,
  criarAgendamento,
  atualizarAgendamento,
  apagarAgendamento,
  dataLocalISO,
} from '../../api';

function paraMinutos(hhmm) {
  if (!hhmm) return 0;
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function Painel() {
  const { barbeiroLogado } = useBarbeiro();
  const hojeISO = dataLocalISO();

  const [dataSelecionada, setDataSelecionada] = useState(hojeISO);
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [abaAtual, setAbaAtual] = useState('pending');
  const [busca, setBusca] = useState('');
  const [filtroBarbeiro, setFiltroBarbeiro] = useState('all');
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [agendamentoPagando, setAgendamentoPagando] = useState(null);
  const [agendamentoConsumindo, setAgendamentoConsumindo] = useState(null);

  const [agoraMinutos, setAgoraMinutos] = useState(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });

  const ehHoje = dataSelecionada === hojeISO;

  const carregar = async () => {
    try {
      setErro(null);
      setCarregando(true);
      const dados = await listarAgendamentos(dataSelecionada);
      setAgendamentos(dados);
    } catch (e) {
      console.error(e);
      setErro('Não foi possível carregar os agendamentos.');
    } finally {
      setCarregando(false);
    }
  };

  // Recarrega sempre que a data mudar
  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSelecionada]);

  // Relógio interno pra atualizar "atrasado"
  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setAgoraMinutos(d.getHours() * 60 + d.getMinutes());
    }, 30 * 1000);
    return () => clearInterval(t);
  }, []);

  const meusAgendamentos = useMemo(
    () => agendamentos.filter((a) => a.barbeiro === barbeiroLogado),
    [agendamentos, barbeiroLogado]
  );

  const contadores = useMemo(
    () => ({
      pendentes: meusAgendamentos.filter((a) => a.status === 'pending').length,
      concluidos: meusAgendamentos.filter((a) => a.status === 'completed').length,
    }),
    [meusAgendamentos]
  );

  const proximoId = useMemo(() => {
    if (!ehHoje) return null;
    const pendentes = meusAgendamentos
      .filter((a) => a.status === 'pending')
      .filter((a) => paraMinutos(a.horario) >= agoraMinutos)
      .sort((a, b) => paraMinutos(a.horario) - paraMinutos(b.horario));
    return pendentes[0]?.id || null;
  }, [meusAgendamentos, agoraMinutos, ehHoje]);

  const temPendenteFuturo = useMemo(() => {
    if (!ehHoje) {
      return meusAgendamentos.some((a) => a.status === 'pending');
    }
    return meusAgendamentos.some(
      (a) => a.status === 'pending' && paraMinutos(a.horario) >= agoraMinutos
    );
  }, [meusAgendamentos, agoraMinutos, ehHoje]);

  const atrasadosCount = useMemo(() => {
    if (!ehHoje) return 0;
    return meusAgendamentos.filter(
      (a) => a.status === 'pending' && paraMinutos(a.horario) < agoraMinutos
    ).length;
  }, [meusAgendamentos, agoraMinutos, ehHoje]);

  const listaFiltrada = useMemo(() => {
    let lista = meusAgendamentos.filter((a) => a.status === abaAtual);

    if (busca.trim()) {
      const q = busca.toLowerCase();
      lista = lista.filter(
        (a) =>
          a.clienteNome.toLowerCase().includes(q) ||
          a.servico.toLowerCase().includes(q)
      );
    }

    if (filtroBarbeiro !== 'all') {
      lista = lista.filter((a) => a.barbeiro === filtroBarbeiro);
    }

    if (abaAtual === 'pending') {
      lista = [...lista].sort((a, b) => {
        const aMin = paraMinutos(a.horario);
        const bMin = paraMinutos(b.horario);
        if (!ehHoje) return aMin - bMin;
        const aFuturo = aMin >= agoraMinutos;
        const bFuturo = bMin >= agoraMinutos;
        if (aFuturo && bFuturo) return aMin - bMin;
        if (!aFuturo && !bFuturo) return aMin - bMin;
        return aFuturo ? -1 : 1;
      });
    } else {
      lista = [...lista].sort((a, b) => b.horario.localeCompare(a.horario));
    }

    return lista;
  }, [meusAgendamentos, abaAtual, busca, filtroBarbeiro, agoraMinutos, ehHoje]);

  const abrirModalPagamento = (ag) => setAgendamentoPagando(ag);

  const confirmarPagamento = async (formaPagamento) => {
    try {
      await atualizarAgendamento(agendamentoPagando.id, {
        status: 'completed',
        pagamento: formaPagamento,
      });
      setAgendamentoPagando(null);
      await carregar();
    } catch (e) {
      console.error(e);
      alert('Erro ao concluir. Tente de novo.');
    }
  };

  const cancelar = async (id) => {
    if (!confirm('Apagar este agendamento?')) return;
    try {
      await apagarAgendamento(id);
      await carregar();
    } catch (e) {
      console.error(e);
      alert('Erro ao apagar. Tente de novo.');
    }
  };

  const reverter = async (id) => {
    try {
      await atualizarAgendamento(id, { status: 'pending', pagamento: null });
      await carregar();
    } catch (e) {
      console.error(e);
      alert('Erro ao reverter. Tente de novo.');
    }
  };

  const salvarNovo = async (dados) => {
    try {
      await criarAgendamento({ ...dados, data: dataSelecionada });
      setModalNovoAberto(false);
      await carregar();
    } catch (e) {
      console.error(e);
      alert('Erro ao criar agendamento. Tente de novo.');
    }
  };

  const abrirModalConsumo = (ag) => setAgendamentoConsumindo(ag);

  const salvarConsumo = async (consumoNovo) => {
    try {
      const totalConsumo = consumoNovo.reduce((acc, p) => acc + p.preco, 0);
      const precoServicoBase =
        agendamentoConsumindo.preco -
        (agendamentoConsumindo.consumo || []).reduce((acc, p) => acc + p.preco, 0);
      const novoPreco = precoServicoBase + totalConsumo;

      await atualizarAgendamento(agendamentoConsumindo.id, {
        consumo: consumoNovo,
        preco: novoPreco,
      });
      setAgendamentoConsumindo(null);
      await carregar();
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar consumo. Tente de novo.');
    }
  };

  const mostrarTudoFeito =
    abaAtual === 'pending' &&
    listaFiltrada.length === 0 &&
    !temPendenteFuturo &&
    contadores.concluidos > 0 &&
    !busca &&
    filtroBarbeiro === 'all';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <AdminHeader onNovoAgendamento={() => setModalNovoAberto(true)} />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <MetricasBar agendamentos={agendamentos} barbeiro={barbeiroLogado} />

        <SeletorData
          dataSelecionada={dataSelecionada}
          hojeISO={hojeISO}
          onChange={setDataSelecionada}
        />

        {erro && (
          <div className="flex items-start gap-3 bg-red-950/30 border border-red-900/40 rounded-2xl p-4">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{erro}</p>
          </div>
        )}

        {atrasadosCount > 0 && (
          <div className="flex items-start gap-3 bg-red-950/30 border border-red-900/40 rounded-2xl p-4">
            <div className="w-9 h-9 rounded-xl bg-red-950/60 flex items-center justify-center text-red-400/80 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-300/90">
                {atrasadosCount === 1
                  ? '1 agendamento atrasado'
                  : `${atrasadosCount} agendamentos atrasados`}
              </p>
              <p className="text-xs text-red-200/50 mt-0.5">
                Horários que já passaram e continuam pendentes.
              </p>
            </div>
          </div>
        )}

        <FiltrosBar
          abaAtual={abaAtual}
          onTrocarAba={setAbaAtual}
          busca={busca}
          onBuscaChange={setBusca}
          filtroBarbeiro={filtroBarbeiro}
          onFiltroBarbeiroChange={setFiltroBarbeiro}
          contadores={contadores}
        />

        {carregando ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mb-4" />
            <p className="text-sm text-zinc-400">Carregando agendamentos...</p>
          </div>
        ) : mostrarTudoFeito ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-emerald-300">
              Tudo concluído por hoje
            </h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              Não há mais agendamentos pendentes.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-4">
              <Moon className="w-3.5 h-3.5" />
              <span>Bom descanso, {barbeiroLogado}.</span>
            </div>
          </div>
        ) : listaFiltrada.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
              <CalendarOff className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-zinc-300">
              Nenhum agendamento encontrado
            </h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              Não há registros para esta data.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {listaFiltrada.map((a) => (
              <CardAgendamento
                key={a.id}
                agendamento={a}
                ehProximo={
                  a.id === proximoId &&
                  abaAtual === 'pending' &&
                  !busca &&
                  filtroBarbeiro === 'all'
                }
                ehAtrasado={
                  ehHoje &&
                  a.status === 'pending' &&
                  paraMinutos(a.horario) < agoraMinutos
                }
                onConcluir={abrirModalPagamento}
                onCancelar={cancelar}
                onReverter={reverter}
                onAdicionarConsumo={abrirModalConsumo}
              />
            ))}
          </div>
        )}
      </main>

      <ModalNovoAgendamento
        aberto={modalNovoAberto}
        onFechar={() => setModalNovoAberto(false)}
        onSalvar={salvarNovo}
        agendamentos={agendamentos}
      />

      <ModalPagamento
        aberto={!!agendamentoPagando}
        agendamento={agendamentoPagando}
        onFechar={() => setAgendamentoPagando(null)}
        onConfirmar={confirmarPagamento}
      />

      <ModalConsumo
        aberto={!!agendamentoConsumindo}
        agendamento={agendamentoConsumindo}
        onFechar={() => setAgendamentoConsumindo(null)}
        onSalvar={salvarConsumo}
      />
    </div>
  );
}

export default Painel;