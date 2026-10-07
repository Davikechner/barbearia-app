import { getPool } from '../_db.js';

export default async function handler(req, res) {
  const pool = getPool();
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ erro: 'ID obrigatório' });
  }

  if (req.method === 'PUT') {
    try {
      const { status, pagamento, consumo, preco } = req.body;

      const campos = [];
      const valores = [];

      if (status !== undefined) {
        if (!['pending', 'completed', 'cancelled'].includes(status)) {
          return res.status(400).json({ erro: 'Status inválido' });
        }
        campos.push('status = ?');
        valores.push(status);
      }

      if (pagamento !== undefined) {
        campos.push('pagamento = ?');
        // Se for null, string vazia ou undefined → NULL
        valores.push(pagamento || null);
      }

      if (consumo !== undefined) {
        campos.push('consumo = ?');
        valores.push(JSON.stringify(consumo));
      }

      if (preco !== undefined) {
        campos.push('preco = ?');
        valores.push(preco);
      }

      if (campos.length === 0) {
        return res.status(400).json({ erro: 'Nada para atualizar' });
      }

      valores.push(id);

      console.log('UPDATE:', `UPDATE agendamentos SET ${campos.join(', ')} WHERE id = ?`, valores);

      await pool.execute(
        `UPDATE agendamentos SET ${campos.join(', ')} WHERE id = ?`,
        valores
      );

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('Erro ao atualizar:', err);
      return res.status(500).json({ erro: 'Erro ao atualizar', detalhes: String(err) });
    }
  }

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