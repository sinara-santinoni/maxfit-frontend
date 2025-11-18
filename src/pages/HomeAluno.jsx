import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

/**
 * Página inicial do Aluno
 * Exibe cards com acesso rápido às funcionalidades
 */
const HomeAluno = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Cards de menu com ícones e navegação
  const menuItems = [
    {
      title: 'Meus Treinos',
      icon: '💪',
      description: 'Acesse seus treinos personalizados',
      path: '/treinos',
      color: 'bg-orange-500',
    },
    {
      title: 'Diário de Treino',
      icon: '📝',
      description: 'Registre seu progresso diário',
      path: '/diario',
      color: 'bg-blue-500',
    },
    {
      title: 'Desafios',
      icon: '🏆',
      description: 'Participe de desafios e metas',
      path: '/desafios',
      color: 'bg-green-500',
    },
    {
      title: 'Comunidade',
      icon: '👥',
      description: 'Conecte-se com outros alunos',
      path: '/comunidade',
      color: 'bg-purple-500',
    },
    {
      title: 'Suporte',
      icon: '💬',
      description: 'Suporte psicológico e nutricional',
      path: '/suporte',
      color: 'bg-pink-500',
    },
    {
      title: 'Meu Progresso',
      icon: '📊',
      description: 'Acompanhe sua evolução',
      path: '/progresso',
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header fixo */}
      <Header title="MaxFit" />

      {/* Conteúdo principal */}
      <main className="pt-20 px-4 max-w-md mx-auto">
        {/* Card de boas-vindas */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 mb-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">
            Olá, {user?.nome?.split(' ')[0]}! 👋
          </h2>
          <p className="text-white/90">
            Pronto para treinar hoje? Vamos alcançar suas metas!
          </p>
        </div>

        {/* Grid de cards de menu */}
        <div className="grid grid-cols-2 gap-4 mb-6">
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

        {/* Card de motivação */}
        <div className="bg-white rounded-xl p-5 shadow-md">
          <h3 className="font-bold text-dark mb-2 flex items-center">
            <span className="mr-2">💡</span>
            Dica do dia
          </h3>
          <p className="text-sm text-gray-700">
            "O sucesso é a soma de pequenos esforços repetidos dia após dia."
          </p>
        </div>
      </main>

      {/* Navegação inferior */}
      <BottomNav />
    </div>
  );
};

export default HomeAluno;