const API_BASE = '/api';

export async function listarAgendamentos() {
  const res = await fetch(`${API_BASE}/agendamentos`);
  if (!res.ok) throw new Error('Erro ao listar agendamentos');
  return res.json();
}

export async function criarAgendamento(dados) {
  const res = await fetch(`${API_BASE}/agendamentos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error('Erro ao criar agendamento');
  return res.json();
}

export async function atualizarAgendamento(id, dados) {
  const res = await fetch(`${API_BASE}/agendamentos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error('Erro ao atualizar agendamento');
  return res.json();
}

export async function apagarAgendamento(id) {
  const res = await fetch(`${API_BASE}/agendamentos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao apagar agendamento');
  return res.json();
}

export async function listarHorariosOcupados(barbeiro, data) {
  const params = new URLSearchParams({ barbeiro });
  if (data) params.append('data', data);
  const res = await fetch(`${API_BASE}/horarios-ocupados?${params}`);
  if (!res.ok) throw new Error('Erro ao listar horários');
  return res.json();
}