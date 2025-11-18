import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';

// Páginas públicas
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';

// Páginas do aluno
import HomeAluno from './pages/HomeAluno';
import TreinosAluno from './pages/TreinosAluno';
import DiarioTreino from './pages/DiarioTreino';
import Desafios from './pages/Desafios';
import Comunidade from './pages/Comunidade';
import Suporte from './pages/Suporte';
import MeuProgresso from './pages/MeuProgresso'; // 🌟 NOVO

// Páginas do personal
import HomePersonal from './pages/HomePersonal';

/**
 * Componente de redirecionamento inicial
 * Redireciona para a home correta conforme o tipo de usuário
 */
function RedirectHome() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (user?.tipo === 'ALUNO') {
    return <Navigate to="/home-aluno" replace />;
  } else if (user?.tipo === 'PERSONAL') {
    return <Navigate to="/home-personal" replace />;
  }

  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota inicial - redireciona conforme autenticação */}
          <Route path="/" element={<RedirectHome />} />

          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rotas protegidas do ALUNO */}
          <Route
            path="/home-aluno"
            element={
              <PrivateRoute requiredType="ALUNO">
                <HomeAluno />
              </PrivateRoute>
            }
          />
          <Route
            path="/treinos"
            element={
              <PrivateRoute requiredType="ALUNO">
                <TreinosAluno />
              </PrivateRoute>
            }
          />
          <Route
            path="/diario"
            element={
              <PrivateRoute requiredType="ALUNO">
                <DiarioTreino />
              </PrivateRoute>
            }
          />
          <Route
            path="/desafios"
            element={
              <PrivateRoute>
                <Desafios />
              </PrivateRoute>
            }
          />
          <Route
            path="/comunidade"
            element={
              <PrivateRoute>
                <Comunidade />
              </PrivateRoute>
            }
          />
          <Route
            path="/suporte"
            element={
              <PrivateRoute>
                <Suporte />
              </PrivateRoute>
            }
          />

          {/* 🌟 NOVA ROTA: MEU PROGRESSO (ALUNO) */}
          <Route
            path="/meu-progresso"
            element={
              <PrivateRoute requiredType="ALUNO">
                <MeuProgresso />
              </PrivateRoute>
            }
          />

          {/* Rotas protegidas do PERSONAL */}
          <Route
            path="/home-personal"
            element={
              <PrivateRoute requiredType="PERSONAL">
                <HomePersonal />
              </PrivateRoute>
            }
          />

          {/* Rota 404 - página não encontrada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
