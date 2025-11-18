import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

/**
 * Página inicial do Personal Trainer
 * Exibe opções de gerenciamento de alunos e treinos
 */
const HomePersonal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Cards de menu para personal
  const menuItems = [
    {
      title: 'Meus Alunos',
      icon: '👥',
      description: 'Gerenciar lista de alunos',
      path: '/gerenciar-alunos',
      color: 'bg-blue-500',
    },
    {
      title: 'Criar Treino',
      icon: '📝',
      description: 'Montar novos treinos',
      path: '/criar-treino',
      color: 'bg-orange-500',
    },
    {
      title: 'Ver Progresso',
      icon: '📊',
      description: 'Acompanhar evolução dos alunos',
      path: '/progresso-alunos',
      color: 'bg-green-500',
    },
    {
      title: 'Criar Desafio',
      icon: '🏆',
      description: 'Criar desafios para alunos',
      path: '/criar-desafio',
      color: 'bg-yellow-500',
    },
    {
      title: 'Comunidade',
      icon: '💬',
      description: 'Interagir com a comunidade',
      path: '/comunidade',
      color: 'bg-purple-500',
    },
    {
      title: 'Mensagens',
      icon: '✉️',
      description: 'Conversar com alunos',
      path: '/mensagens',
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header fixo */}
      <Header title="MaxFit Pro" />

      {/* Conteúdo principal */}
      <main className="pt-20 px-4 max-w-md mx-auto">
        {/* Card de boas-vindas */}
        <div className="bg-gradient-to-r from-secondary to-primary rounded-2xl p-6 mb-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">
            Olá, Personal {user?.nome?.split(' ')[0]}! 👨‍🏫
          </h2>
          <p className="text-white/90">
            Pronto para treinar seus alunos hoje?
          </p>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-xs text-gray-600">Alunos</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <p className="text-2xl font-bold text-green-500">8</p>
            <p className="text-xs text-gray-600">Treinos</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <p className="text-2xl font-bold text-blue-500">3</p>
            <p className="text-xs text-gray-600">Desafios</p>
          </div>
        </div>

        {/* Grid de cards de menu */}
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <div className={`${item.color} w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-3 mx-auto`}>
                {item.icon}
              </div>
              <h3 className="font-bold text-dark mb-1 text-sm">
                {item.title}
              </h3>
              <p className="text-xs text-gray-600">
                {item.description}
              </p>
            </button>
          ))}
        </div>
      </main>

      {/* Navegação inferior */}
      <BottomNav />
    </div>
  );
};

export default HomePersonal;