import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de cabeçalho fixo no topo
 * Mostra o nome do usuário e botão de logout
 */
const Header = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary text-white fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{title || 'MaxFit'}</h1>
          {user && (
            <p className="text-sm opacity-90">Olá, {user.nome}</p>
          )}
        </div>
        
        <button
          onClick={handleLogout}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          Sair
        </button>
      </div>
    </header>
  );
};

export default Header;