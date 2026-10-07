import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Lock, Loader2, AlertCircle } from 'lucide-react';
import { fazerLogin } from '../api';

function Login() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const entrar = async (e) => {
    e.preventDefault();
    if (!senha) return;

    try {
      setCarregando(true);
      setErro('');
      await fazerLogin(senha);
      navigate('/admin');
    } catch (err) {
      setErro(err.message || 'Erro ao fazer login');
      setSenha('');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20 mb-4">
            <Scissors className="w-8 h-8 text-zinc-950" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            GUI BARBEIRO
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Painel Administrativo</p>
        </div>

        <form onSubmit={entrar} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              <Lock className="w-3.5 h-3.5 text-yellow-500" />
              Senha de acesso
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite a senha"
              autoFocus
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>

          {erro && (
            <div className="flex items-start gap-2 bg-red-950/30 border border-red-900/40 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{erro}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!senha || carregando}
            className={`w-full font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
              senha && !carregando
                ? 'bg-yellow-500 hover:bg-yellow-400 text-zinc-950 shadow-lg shadow-yellow-500/20'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {carregando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <p className="text-[11px] text-zinc-600 text-center mt-6">
          Acesso restrito aos barbeiros
        </p>
      </div>
    </div>
  );
}

export default Login;