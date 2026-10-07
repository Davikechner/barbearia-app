const API_BASE = '/api';

export function dataLocalISO(d = new Date()) {
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export async function fazerLogin(senha) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senha }),
  });
  const dados = await res.json();
  if (!res.ok) throw new Error(dados.erro || 'Erro ao fazer login');
  return dados;
}

export async function fazerLogout() {
  await fetch(`${API_BASE}/logout`, { method: 'POST' });
}

export async function verificarSessao() {
  try {
    const res = await fetch(`${API_BASE}/verificar-sessao`);
    if (!res.ok) return { autenticado: false };
    return res.json();
  } catch {
    return { autenticado: false };
  }
}

export async function listarAgendamentos(data) {
  const url = data
    ? `${API_BASE}/agendamentos?data=${data}`
    : `${API_BASE}/agendamentos`;
  const res = await fetch(url);
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
  const res = await fetch(`${API_BASE}/por-id/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error('Erro ao atualizar agendamento');
  return res.json();
}

export async function apagarAgendamento(id) {
  const res = await fetch(`${API_BASE}/por-id/${id}`, {
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