import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente para proteger rotas que exigem autenticação
 * Se o usuário não estiver logado, redireciona para o login
 */
const PrivateRoute = ({ children, requiredType }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Enquanto carrega, mostrar nada (ou um spinner)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Se exigir um tipo específico de usuário e o tipo não bater, redirecionar
  if (requiredType && user.tipo !== requiredType) {
    return <Navigate to="/" replace />;
  }

  // Se tudo ok, renderizar o componente filho
  return children;
};

export default PrivateRoute;