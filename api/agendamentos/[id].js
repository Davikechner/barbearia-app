import { getPool } from '../_db.js';

export default async function handler(req, res) {
  const pool = getPool();
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ erro: 'ID obrigatório' });
  }

  // PUT — atualizar status e pagamento
  if (req.method === 'PUT') {
    try {
      const { status, pagamento } = req.body;

      if (!status || !['pending', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ erro: 'Status inválido' });
      }

      await pool.execute(
        `UPDATE agendamentos 
         SET status = ?, pagamento = ?
         WHERE id = ?`,
        [status, pagamento || null, id]
      );

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('Erro ao atualizar agendamento:', err);
      return res.status(500).json({ erro: 'Erro ao atualizar' });
    }
  }

  // DELETE — apagar agendamento
  if (req.method === 'DELETE') {
    try {
      await pool.execute('DELETE FROM agendamentos WHERE id = ?', [id]);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('Erro ao apagar:', err);
      return res.status(500).json({ erro: 'Erro ao apagar' });
    }
  }

  return res.status(405).json({ erro: 'Método não permitido' });
}