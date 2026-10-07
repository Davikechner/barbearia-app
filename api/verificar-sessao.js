import { validarToken, getSessionFromRequest } from './_auth.js';

export default function handler(req, res) {
  const token = getSessionFromRequest(req);
  const autenticado = validarToken(token);
  return res.status(200).json({ autenticado });
}