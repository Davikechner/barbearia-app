import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { verificarSessao } from '../api';

function ProtectedRoute({ children }) {
  const [estado, setEstado] = useState('verificando');

  useEffect(() => {
    let cancelado = false;
    verificarSessao().then((r) => {
      if (!cancelado) {
        setEstado(r.autenticado ? 'autenticado' : 'nao-autenticado');
      }
    });
    return () => {
      cancelado = true;
    };
  }, []);

  if (estado === 'verificando') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (estado === 'nao-autenticado') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;