import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { AgendamentoProvider } from './context/AgendamentoContext.jsx';
import { BarbeiroProvider } from './context/BarbeiroContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Cliente/Home.jsx';
import Servico from './pages/Cliente/agendar/Servico.jsx';
import Barbeiro from './pages/Cliente/agendar/Barbeiro.jsx';
import Horario from './pages/Cliente/agendar/Horario.jsx';
import Confirmar from './pages/Cliente/agendar/Confirmar.jsx';
import Sucesso from './pages/Cliente/agendar/Sucesso.jsx';
import Painel from './pages/Admin/Painel.jsx';
import Login from './pages/Login.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AgendamentoProvider>
        <BarbeiroProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agendar/servico" element={<Servico />} />
            <Route path="/agendar/barbeiro" element={<Barbeiro />} />
            <Route path="/agendar/horario" element={<Horario />} />
            <Route path="/agendar/confirmar" element={<Confirmar />} />
            <Route path="/agendar/sucesso" element={<Sucesso />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Painel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BarbeiroProvider>
      </AgendamentoProvider>
    </BrowserRouter>
  </StrictMode>,
);