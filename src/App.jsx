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
import SuportePsicologico from './pages/SuportePsicologico';
import SuporteNutricionista from './pages/SuporteNutricionista';
import SuporteTutoriais from './pages/SuporteTutoriais';
import SuporteDicas from './pages/SuporteDicas';
import MeuProgresso from './pages/MeuProgresso';

// Páginas do personal
import HomePersonal from './pages/HomePersonal';

// 🟧 IMPORTA AS NOVAS PÁGINAS DO PERSONAL
import AdicionarAluno from './pages/AdicionarAluno';
import MeusAlunos from './pages/MeusAlunos';

// 🆕 IMPORTA A NOVA TELA DE TREINO (ADICIONADO AGORA)
import CriarTreino from './pages/CriarTreino';

/**
 * Redirecionamento inicial
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

          {/* Rota inicial */}
          <Route path="/" element={<RedirectHome />} />

          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rotas protegidas do aluno */}
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

          {/* 👉 Suporte principal */}
          <Route
            path="/suporte"
            element={
              <PrivateRoute>
                <Suporte />
              </PrivateRoute>
            }
          />

          {/* 👉 Subpáginas do suporte */}
          <Route
            path="/suporte/psicologico"
            element={
              <PrivateRoute>
                <SuportePsicologico />
              </PrivateRoute>
            }
          />

          <Route
            path="/suporte/nutricionista"
            element={
              <PrivateRoute>
                <SuporteNutricionista />
              </PrivateRoute>
            }
          />

          <Route
            path="/suporte/tutoriais"
            element={
              <PrivateRoute>
                <SuporteTutoriais />
              </PrivateRoute>
            }
          />

          <Route
            path="/suporte/dicas"
            element={
              <PrivateRoute>
                <SuporteDicas />
              </PrivateRoute>
            }
          />

          {/* Meu progresso */}
          <Route
            path="/progresso"
            element={
              <PrivateRoute requiredType="ALUNO">
                <MeuProgresso />
              </PrivateRoute>
            }
          />

          {/* Personal */}
          <Route
            path="/home-personal"
            element={
              <PrivateRoute requiredType="PERSONAL">
                <HomePersonal />
              </PrivateRoute>
            }
          />

          {/* 🟧 NOVAS ROTAS DO PERSONAL */}
          <Route
            path="/personal/adicionar-aluno"
            element={
              <PrivateRoute requiredType="PERSONAL">
                <AdicionarAluno />
              </PrivateRoute>
            }
          />

          <Route
            path="/personal/alunos"
            element={
              <PrivateRoute requiredType="PERSONAL">
                <MeusAlunos />
              </PrivateRoute>
            }
          />

          {/* 🆕 ROTA NOVA → CRIAR TREINO */}
          <Route
            path="/criar-treino"
            element={
              <PrivateRoute requiredType="PERSONAL">
                <CriarTreino />
              </PrivateRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
