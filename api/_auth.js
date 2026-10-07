import crypto from 'crypto';
import { getPool } from './_db.js';

const COOKIE_NAME = 'barbearia_session';
const DIAS_VALIDOS = 30;
const MAX_TENTATIVAS = 5;
const BLOQUEIO_MINUTOS = 5;

function getSecret() {
  return process.env.SESSION_SECRET || 'dev-secret-nao-use-em-producao';
}

export function gerarToken() {
  const expiraEm = Date.now() + DIAS_VALIDOS * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ exp: expiraEm })).toString('base64url');
  const assinatura = crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('base64url');
  return `${payload}.${assinatura}`;
}

export function validarToken(token) {
  if (!token || typeof token !== 'string') return false;
  const partes = token.split('.');
  if (partes.length !== 2) return false;

  const [payload, assinatura] = partes;

  const esperada = crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('base64url');

  if (assinatura !== esperada) return false;

  try {
    const dados = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!dados.exp || dados.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export function getIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return String(forwarded).split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'desconhecido';
}

export async function estaBloqueado(ip) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT tentativas, bloqueado_ate FROM tentativas_login WHERE ip = ? LIMIT 1',
      [ip]
    );

    if (rows.length === 0) return { bloqueado: false, tentativas: 0 };

    const { tentativas, bloqueado_ate } = rows[0];

    if (bloqueado_ate) {
      const agora = new Date();
      const bloqueio = new Date(bloqueado_ate);
      if (bloqueio > agora) {
        const segundos = Math.ceil((bloqueio - agora) / 1000);
        return { bloqueado: true, tentativas, segundosRestantes: segundos };
      }
    }

    return { bloqueado: false, tentativas };
  } catch (err) {
    console.error('Erro ao checar bloqueio:', err);
    return { bloqueado: false, tentativas: 0 };
  }
}

export async function registrarTentativaFalha(ip) {
  try {
    const pool = getPool();

    const [rows] = await pool.execute(
      'SELECT tentativas FROM tentativas_login WHERE ip = ? LIMIT 1',
      [ip]
    );

    const tentativas = rows.length > 0 ? rows[0].tentativas + 1 : 1;

    if (tentativas >= MAX_TENTATIVAS) {
      await pool.execute(
        `INSERT INTO tentativas_login (ip, tentativas, bloqueado_ate)
         VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))
         ON DUPLICATE KEY UPDATE 
           tentativas = VALUES(tentativas),
           bloqueado_ate = VALUES(bloqueado_ate)`,
        [ip, tentativas, BLOQUEIO_MINUTOS]
      );
    } else {
      await pool.execute(
        `INSERT INTO tentativas_login (ip, tentativas, bloqueado_ate)
         VALUES (?, ?, NULL)
         ON DUPLICATE KEY UPDATE 
           tentativas = VALUES(tentativas),
           bloqueado_ate = NULL`,
        [ip, tentativas]
      );
    }
  } catch (err) {
    console.error('Erro ao registrar falha:', err);
  }
}

export async function limparTentativas(ip) {
  try {
    const pool = getPool();
    await pool.execute('DELETE FROM tentativas_login WHERE ip = ?', [ip]);
  } catch (err) {
    console.error('Erro ao limpar tentativas:', err);
  }
}

export function setSessionCookie(res, token) {
  const maxAge = DIAS_VALIDOS * 24 * 60 * 60;
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
  );
}

export function clearSessionCookie(res) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  );
}

export function getSessionFromRequest(req) {
  const cookieHeader = req.headers.cookie || '';
  const cookies = cookieHeader.split(';').reduce((acc, c) => {
    const [k, ...v] = c.trim().split('=');
    if (k) acc[k] = v.join('=');
    return acc;
  }, {});
  return cookies[COOKIE_NAME];
}

export { COOKIE_NAME, MAX_TENTATIVAS, BLOQUEIO_MINUTOS };