import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protege rotas que exigem login e/ou tipo de usuário (ALUNO / PERSONAL)
 */
const PrivateRoute = ({ children, requiredType }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Enquanto o app está validando o login
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não estiver autenticado → volta pro login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Segurança extra: se o user ainda estiver null (caso raro)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Caso o tipo obrigatório não bata (ALUNO / PERSONAL)
  if (requiredType) {
    const tipoNormalizado = (user.tipo || '').trim().toUpperCase();

    if (tipoNormalizado !== requiredType.toUpperCase()) {
      return <Navigate to="/" replace />;
    }
  }

  // Tudo certo → libera acesso
  return children;
};

export default PrivateRoute;
