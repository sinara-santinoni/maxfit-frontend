import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Barra de navegação inferior estilo app mobile
 * Muda os links conforme o tipo de usuário (aluno ou personal)
 */
const BottomNav = () => {
  const { isAluno } = useAuth();

  // Links para aluno
  const alunoLinks = [
    { path: '/home-aluno', icon: '🏠', label: 'Início' },
    { path: '/treinos', icon: '💪', label: 'Treinos' },
    { path: '/desafios', icon: '🏆', label: 'Desafios' },
    { path: '/comunidade', icon: '👥', label: 'Comunidade' },
    { path: '/suporte', icon: '💬', label: 'Suporte' },
  ];

  // Links para personal
  const personalLinks = [
    { path: '/home-personal', icon: '🏠', label: 'Início' },
    { path: '/gerenciar-alunos', icon: '👥', label: 'Alunos' },
    { path: '/criar-treino', icon: '📝', label: 'Treinos' },
    { path: '/desafios', icon: '🏆', label: 'Desafios' },
    { path: '/comunidade', icon: '💬', label: 'Comunidade' },
  ];

  const links = isAluno() ? alunoLinks : personalLinks;

  return (
    <nav className="bg-white fixed bottom-0 left-0 right-0 z-50 shadow-lg border-t border-gray-200">
      <div className="max-w-md mx-auto flex justify-around">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-3 px-2 transition-colors flex-1 ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`
            }
          >
            <span className="text-2xl mb-1">{link.icon}</span>
            <span className="text-xs font-medium">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;