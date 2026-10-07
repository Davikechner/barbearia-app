import { useState, useMemo, useEffect } from 'react';
import { CalendarOff, CheckCircle2, Moon, AlertCircle } from 'lucide-react';
import AdminHeader from '../../components/Admin/AdminHeader';
import MetricasBar from '../../components/Admin/MetricasBar';
import FiltrosBar from '../../components/Admin/FiltrosBar';
import CardAgendamento from '../../components/Admin/CardAgendamento';
import ModalNovoAgendamento from '../../components/Admin/ModalNovoAgendamento';
import ModalPagamento from '../../components/Admin/ModalPagamento';
import ModalConsumo from '../../components/Admin/ModalConsumo';
import { useBarbeiro } from '../../context/BarbeiroContext';

const AGENDAMENTOS_INICIAIS = [
  { id: '1', clienteNome: 'Matheus Henrique', telefone: '(11) 98765-4321', servico: 'Corte Degradê', preco: 45, barbeiro: 'Kauan', horario: '13:30', status: 'pending', consumo: [] },
  { id: '2', clienteNome: 'Lucas Oliveira', telefone: '(11) 97123-4567', servico: 'Corte + Barba', preco: 70, barbeiro: 'Guilherme', horario: '13:30', status: 'pending', consumo: [] },
  { id: '3', clienteNome: 'Rafael Souza', telefone: '(11) 96543-2109', servico: 'Barba Terapia', preco: 35, barbeiro: 'Kauan', horario: '11:00', status: 'completed', pagamento: 'pix', consumo: [] },
  { id: '4', clienteNome: 'Bruno Gabriel', telefone: '(11) 95432-1098', servico: 'Corte Degradê', preco: 45, barbeiro: 'Guilherme', horario: '14:30', status: 'pending', consumo: [] },
  { id: '5', clienteNome: 'Thiago Martins', telefone: '(11) 94321-0987', servico: 'Sobrancelha', preco: 20, barbeiro: 'Kauan', horario: '15:00', status: 'pending', consumo: [] },
  { id: '6', clienteNome: 'Pedro Henrique', telefone: '(11) 93210-9876', servico: 'Corte + Barba', preco: 70, barbeiro: 'Guilherme', horario: '09:30', status: 'completed', pagamento: 'dinheiro', consumo: [{ id: 'bananinha', nome: 'Bananinha Frita', preco: 5 }] },
];

function paraMinutos(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function Painel() {
  const { barbeiroLogado } = useBarbeiro();
  const [agendamentos, setAgendamentos] = useState(AGENDAMENTOS_INICIAIS);
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
    const pendentes = meusAgendamentos
      .filter((a) => a.status === 'pending')
      .filter((a) => paraMinutos(a.horario) >= agoraMinutos)
      .sort((a, b) => paraMinutos(a.horario) - paraMinutos(b.horario));
    return pendentes[0]?.id || null;
  }, [meusAgendamentos, agoraMinutos]);

  const temPendenteFuturo = useMemo(
    () =>
      meusAgendamentos.some(
        (a) => a.status === 'pending' && paraMinutos(a.horario) >= agoraMinutos
      ),
    [meusAgendamentos, agoraMinutos]
  );

  const atrasadosCount = useMemo(
    () =>
      meusAgendamentos.filter(
        (a) => a.status === 'pending' && paraMinutos(a.horario) < agoraMinutos
      ).length,
    [meusAgendamentos, agoraMinutos]
  );

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
  }, [meusAgendamentos, abaAtual, busca, filtroBarbeiro, agoraMinutos]);

  const abrirModalPagamento = (ag) => setAgendamentoPagando(ag);

  const confirmarPagamento = (formaPagamento) => {
    setAgendamentos((prev) =>
      prev.map((a) =>
        a.id === agendamentoPagando.id
          ? { ...a, status: 'completed', pagamento: formaPagamento }
          : a
      )
    );
    setAgendamentoPagando(null);
  };

  const cancelar = (id) => {
    setAgendamentos((prev) => prev.filter((a) => a.id !== id));
  };

  const reverter = (id) => {
    setAgendamentos((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'pending', pagamento: null } : a
      )
    );
  };

  const salvarNovo = (dados) => {
    const novo = {
      id: Date.now().toString(),
      ...dados,
      status: 'pending',
      consumo: [],
    };
    setAgendamentos((prev) => [...prev, novo]);
    setModalNovoAberto(false);
  };

  const abrirModalConsumo = (ag) => setAgendamentoConsumindo(ag);

  const salvarConsumo = (consumoNovo) => {
    setAgendamentos((prev) =>
      prev.map((a) => {
        if (a.id !== agendamentoConsumindo.id) return a;
        const totalConsumo = consumoNovo.reduce((acc, p) => acc + p.preco, 0);
        const precoServicoBase =
          a.preco - (a.consumo || []).reduce((acc, p) => acc + p.preco, 0);
        return {
          ...a,
          consumo: consumoNovo,
          preco: precoServicoBase + totalConsumo,
        };
      })
    );
    setAgendamentoConsumindo(null);
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
                Horários que já passaram e continuam pendentes. Eles estão no
                final da fila — resolva conforme puder.
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

        {mostrarTudoFeito ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-emerald-300">
              Tudo concluído por hoje
            </h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              Não há mais agendamentos pendentes. Os novos aparecerão aqui
              automaticamente.
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
              Não há registros correspondentes nesta aba ou filtro no momento.
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