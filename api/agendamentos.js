import { getPool } from './_db.js';

export default async function handler(req, res) {
  const pool = getPool();

  // GET — listar todos os agendamentos de hoje
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.execute(
        `SELECT 
           id,
           cliente_nome AS clienteNome,
           telefone,
           servico,
           preco,
           barbeiro,
           horario,
           data,
           status,
           pagamento
         FROM agendamentos
         WHERE data = CURDATE()
         ORDER BY horario ASC`
      );
      return res.status(200).json(rows);
    } catch (err) {
      console.error('Erro ao listar agendamentos:', err);
      return res.status(500).json({ erro: 'Erro ao buscar agendamentos' });
    }
  }

  // POST — criar novo agendamento
  if (req.method === 'POST') {
    try {
      const { clienteNome, telefone, servico, preco, barbeiro, horario } = req.body;

      if (!clienteNome || !servico || !barbeiro || !horario) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
      }

      const [result] = await pool.execute(
        `INSERT INTO agendamentos 
           (cliente_nome, telefone, servico, preco, barbeiro, horario, data, status)
         VALUES (?, ?, ?, ?, ?, ?, CURDATE(), 'pending')`,
        [clienteNome, telefone || null, servico, preco, barbeiro, horario]
      );

      return res.status(201).json({
        id: result.insertId,
        clienteNome,
        telefone,
        servico,
        preco,
        barbeiro,
        horario,
        status: 'pending',
      });
    } catch (err) {
      console.error('Erro ao criar agendamento:', err);
      return res.status(500).json({ erro: 'Erro ao criar agendamento' });
    }
  }

  return res.status(405).json({ erro: 'Método não permitido' });
}