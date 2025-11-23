import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { treinoService, usuarioService } from "../services/api";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const TreinoDetalhes = () => {
  const { id: treinoId } = useParams();
  const navigate = useNavigate();

  const [treino, setTreino] = useState(null);
  const [personalNome, setPersonalNome] = useState("Personal Trainer"); // 🆕
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (treinoId) {
      carregarTreino();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treinoId]);

  const carregarTreino = async () => {
    try {
      setLoading(true);
      setErro("");

      // Busca o treino pelo ID
      const data = await treinoService.buscarPorId(treinoId);
      setTreino(data);

      // 🆕 Busca o nome do Personal se houver personalId
      if (data?.personalId) {
        buscarNomePersonal(data.personalId);
      }
    } catch (err) {
      console.error("Erro ao carregar treino:", err);
      setErro("Erro ao carregar detalhes do treino");
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Função para buscar nome do Personal
  const buscarNomePersonal = async (personalId) => {
    try {
      const usuarios = await usuarioService.listarUsuarios();
      const personal = usuarios?.find(u => u.id === personalId);
      
      if (personal?.nome) {
        setPersonalNome(personal.nome);
      }
    } catch (error) {
      console.warn("Não foi possível buscar o nome do personal:", error);
      // Mantém o valor padrão "Personal Trainer"
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  // Erro ou treino não encontrado
  if (!treino) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <Header title="Detalhes do Treino" />
        <main className="pt-20 px-4 max-w-md mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-primary font-semibold mb-4"
          >
            ← Voltar
          </button>
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <p className="text-5xl mb-4">❌</p>
            <p className="text-gray-600 font-semibold mb-2">
              {erro || "Treino não encontrado"}
            </p>
            <button
              onClick={() => navigate("/treinos")}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600"
            >
              Ver meus treinos
            </button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Detalhes do Treino" />

      <main className="pt-20 px-4 max-w-md mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-primary font-semibold mb-4 flex items-center gap-2 hover:text-orange-600"
        >
          ← Voltar
        </button>

        <div className="bg-white p-5 rounded-xl shadow space-y-4">
          {/* Cabeçalho do Treino */}
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold text-dark mb-2">
              {treino.titulo}
            </h2>

            {treino.objetivo && (
              <p className="text-sm text-gray-700">
                <span className="font-semibold">🎯 Objetivo:</span>{" "}
                {treino.objetivo}
              </p>
            )}
          </div>

          {/* Informações do Treino */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Nível</p>
              <p className="font-semibold text-dark">
                {treino.nivel || "Não informado"}
              </p>
            </div>

            {treino.validade && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Validade</p>
                <p className="font-semibold text-dark">
                  {new Date(treino.validade).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}
          </div>

          {/* 🆕 Nome do Personal com ícone */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
            <p className="text-sm flex items-center gap-2">
              <span className="text-2xl">👨‍🏫</span>
              <span className="text-gray-700">
                Criado por: <span className="font-bold text-dark">{personalNome}</span>
              </span>
            </p>
          </div>

          {/* Lista de Exercícios */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
              💪 Exercícios
              <span className="text-sm font-normal text-gray-600">
                ({treino.exercicios?.length || 0})
              </span>
            </h3>

            {(!treino.exercicios || treino.exercicios.length === 0) && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Nenhum exercício cadastrado</p>
              </div>
            )}

            <div className="space-y-3">
              {treino.exercicios?.map((ex, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-dark flex-1">{ex.nome}</h4>
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-700 mb-2">
                    <div>
                      <p className="text-xs text-gray-600">Séries</p>
                      <p className="font-semibold">{ex.series || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Repetições</p>
                      <p className="font-semibold">{ex.repeticoes || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Descanso</p>
                      <p className="font-semibold">
                        {ex.descanso ? `${ex.descanso}s` : "-"}
                      </p>
                    </div>
                  </div>

                  {ex.observacoes && (
                    <div className="mt-3 pt-3 border-t border-orange-200">
                      <p className="text-xs text-gray-600 mb-1">📝 Observações:</p>
                      <p className="text-sm text-gray-700 italic">
                        {ex.observacoes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botão de ação */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate("/treinos")}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Ver todos os treinos
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default TreinoDetalhes;