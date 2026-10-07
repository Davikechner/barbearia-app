import { getPool } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  const { barbeiro, data } = req.query;

  if (!barbeiro) {
    return res.status(400).json({ erro: 'Barbeiro é obrigatório' });
  }

  try {
    const pool = getPool();
    const dataConsulta = data || new Date().toISOString().split('T')[0];

    const [rows] = await pool.execute(
      `SELECT horario 
       FROM agendamentos 
       WHERE barbeiro = ? 
         AND data = ? 
         AND status = 'pending'`,
      [barbeiro, dataConsulta]
    );

    const horarios = rows.map((r) => r.horario);
    return res.status(200).json({ ocupados: horarios });
  } catch (err) {
    console.error('Erro ao buscar horários:', err);
    return res.status(500).json({ erro: 'Erro ao buscar horários' });
  }
}