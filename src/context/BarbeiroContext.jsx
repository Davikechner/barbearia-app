import { createContext, useContext, useState, useEffect } from 'react';

const BarbeiroContext = createContext(null);

export function BarbeiroProvider({ children }) {
  const [barbeiroLogado, setBarbeiroLogado] = useState(() => {
    return localStorage.getItem('barbeiroLogado') || 'Kauan';
  });

  useEffect(() => {
    localStorage.setItem('barbeiroLogado', barbeiroLogado);
  }, [barbeiroLogado]);

  return (
    <BarbeiroContext.Provider value={{ barbeiroLogado, setBarbeiroLogado }}>
      {children}
    </BarbeiroContext.Provider>
  );
}

export function useBarbeiro() {
  const ctx = useContext(BarbeiroContext);
  if (!ctx) throw new Error('useBarbeiro precisa estar dentro de BarbeiroProvider');
  return ctx;
}