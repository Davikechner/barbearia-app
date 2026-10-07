import {
  gerarToken,
  setSessionCookie,
  getIP,
  estaBloqueado,
  registrarTentativaFalha,
  limparTentativas,
  MAX_TENTATIVAS,
} from './_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  const ip = getIP(req);

  const bloqueio = await estaBloqueado(ip);
  if (bloqueio.bloqueado) {
    return res.status(429).json({
      erro: `Muitas tentativas. Tente novamente em ${bloqueio.segundosRestantes}s.`,
      segundosRestantes: bloqueio.segundosRestantes,
    });
  }

  const { senha } = req.body || {};
  const senhaCorreta = process.env.ADMIN_PASSWORD || '1234';

  if (!senha || senha !== senhaCorreta) {
    await registrarTentativaFalha(ip);
    const restantes = MAX_TENTATIVAS - (bloqueio.tentativas + 1);
    return res.status(401).json({
      erro: 'Senha incorreta',
      tentativasRestantes: restantes > 0 ? restantes : 0,
    });
  }

  await limparTentativas(ip);
  const token = gerarToken();
  setSessionCookie(res, token);

  return res.status(200).json({ ok: true });
}