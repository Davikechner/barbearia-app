import { getPool } from './_db.js';

export default async function handler(req, res) {
  const pool = getPool();

  if (req.method === 'GET') {
    try {
      const { data } = req.query;
      const dataConsulta = data || null;

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
           pagamento,
           consumo
         FROM agendamentos
         WHERE data = COALESCE(?, CURDATE())
         ORDER BY horario ASC`,
        [dataConsulta]
      );

      const formatado = rows.map((r) => ({
        ...r,
        preco: Number(r.preco),
        consumo: r.consumo
          ? typeof r.consumo === 'string'
            ? JSON.parse(r.consumo)
            : r.consumo
          : [],
      }));

      return res.status(200).json(formatado);
    } catch (err) {
      console.error('Erro ao listar:', err);
      return res.status(500).json({ erro: 'Erro ao buscar agendamentos' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { clienteNome, telefone, servico, preco, barbeiro, horario, data } = req.body;

      if (!clienteNome || !servico || !barbeiro || !horario) {
        return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
      }

      const dataFinal = data || null;

      const [result] = await pool.execute(
        `INSERT INTO agendamentos 
           (cliente_nome, telefone, servico, preco, barbeiro, horario, data, status)
         VALUES (?, ?, ?, ?, ?, ?, COALESCE(?, CURDATE()), 'pending')`,
        [clienteNome, telefone || null, servico, preco, barbeiro, horario, dataFinal]
      );

      return res.status(201).json({
        id: result.insertId,
        clienteNome,
        telefone,
        servico,
        preco: Number(preco),
        barbeiro,
        horario,
        status: 'pending',
        consumo: [],
      });
    } catch (err) {
      console.error('Erro ao criar:', err);
      return res.status(500).json({ erro: 'Erro ao criar agendamento' });
    }
  }

  return res.status(405).json({ erro: 'Método não permitido' });
}