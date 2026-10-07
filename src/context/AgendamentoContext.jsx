import { createContext, useContext, useState } from 'react';

const AgendamentoContext = createContext(null);

export function AgendamentoProvider({ children }) {
  const [agendamento, setAgendamento] = useState({
    servico: null,      // { nome, preco }
    barbeiro: null,     // 'Kauan' | 'Guilherme'
    data: null,         // '2026-10-07'
    horario: null,      // '09:30'
    nome: '',
    whatsapp: '',
  });

  const atualizar = (campos) => {
    setAgendamento((prev) => ({ ...prev, ...campos }));
  };

  const resetar = () => {
    setAgendamento({
      servico: null,
      barbeiro: null,
      data: null,
      horario: null,
      nome: '',
      whatsapp: '',
    });
  };

  return (
    <AgendamentoContext.Provider value={{ agendamento, atualizar, resetar }}>
      {children}
    </AgendamentoContext.Provider>
  );
}

export function useAgendamento() {
  const ctx = useContext(AgendamentoContext);
  if (!ctx) throw new Error('useAgendamento precisa estar dentro do AgendamentoProvider');
  return ctx;
}