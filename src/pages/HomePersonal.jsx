import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { personalService } from "../services/api";
import { useEffect, useState } from "react";

const HomePersonal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [totalAlunos, setTotalAlunos] = useState(0);

  useEffect(() => {
    if (user?.id) carregarResumo();
  }, [user]);

  /**
   * Carrega a quantidade de alunos vinculados ao personal
   * GET /api/alunos-do-personal/{idPersonal}
   */
  const carregarResumo = async () => {
    try {
      // 🔥 CORREÇÃO PRINCIPAL:
      const alunos = await personalService.listarAlunosDoPersonal(user.id);

      setTotalAlunos(alunos?.length || 0);
    } catch (error) {
      console.error("Erro ao carregar resumo do personal:", error);
    }
  };

  // ============================================
  // MENUS DO PERSONAL — atualizado conforme pedido
  // ============================================
  const menuItems = [
    {
      title: "Adicionar Treino",
      icon: "📝",
      description: "Criar um novo treino para um aluno",
      path: "/criar-treino",
      color: "bg-orange-500",
    },
    {
      title: "Agendar Lembrete",
      icon: "⏰",
      description: "Criar e programar lembretes para alunos",
      path: "/lembretes",
      color: "bg-blue-500",
    },

    // 🔥 NOVO → vai para tela de adicionar aluno (lista todos)
    {
      title: "Adicionar Novo Aluno",
      icon: "👤",
      description: "Vincular um aluno do MaxFit ao personal",
      path: "/personal/adicionar-aluno",
      color: "bg-green-500",
    },

    // 🧡 NOVO → ver apenas alunos vinculados ao personal
    {
      title: "Meus Alunos",
      icon: "📚",
      description: "Lista de alunos já vinculados",
      path: "/personal/alunos",
      color: "bg-yellow-500",
    },

    {
      title: "Criar Postagem",
      icon: "💬",
      description: "Publicar conteúdo na comunidade",
      path: "/comunidade",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="MaxFit Pro" />

      <main className="pt-20 px-4 max-w-md mx-auto">
        {/* CARD DE BOAS-VINDAS */}
        <div className="bg-gradient-to-r from-secondary to-primary rounded-2xl p-6 mb-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">
            Olá, {user?.nome?.split(" ")[0]}! 👨‍🏫
          </h2>
          <p className="text-white/90">Pronto para treinar seus alunos hoje?</p>
        </div>

        {/* ESTATÍSTICAS */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <p className="text-2xl font-bold text-primary">{totalAlunos}</p>
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

        {/* MENU DO PERSONAL */}
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <div
                className={`${item.color} w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-3 mx-auto`}
              >
                {item.icon}
              </div>
              <h3 className="font-bold text-dark mb-1 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-600">{item.description}</p>
            </button>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default HomePersonal;
