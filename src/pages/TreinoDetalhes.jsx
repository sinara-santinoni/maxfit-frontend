import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { treinoService } from "../services/api";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const TreinoDetalhes = () => {
  const { treinoId } = useParams(); // 🔥 AGORA PEGA O PARAM CORRETO
  const navigate = useNavigate();

  const [treino, setTreino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarTreino();
  }, []);

  const carregarTreino = async () => {
    try {
      setLoading(true);

      // 🔥 AQUI ESTAVA ERRADO — AGORA USA A FUNÇÃO QUE CRIAMOS
      const data = await treinoService.buscarPorId(treinoId);

      setTreino(data);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar detalhes do treino");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  if (!treino) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">{erro || "Treino não encontrado"}</p>
      </div>
    );
  }

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

        <div className="bg-white p-5 rounded-xl shadow space-y-4">

          <h2 className="text-xl font-bold text-dark">{treino.titulo}</h2>

          {treino.objetivo && (
            <p><span className="font-semibold">Objetivo:</span> {treino.objetivo}</p>
          )}

          <p>
            <span className="font-semibold">Nível:</span> {treino.nivel || "Não informado"}
          </p>

          {treino.validade && (
            <p>
              <span className="font-semibold">Validade:</span>{" "}
              {treino.validade}
            </p>
          )}

          <p className="text-sm text-gray-500">
            Criado por: Personal Trainer
          </p>

          <hr />

          <h3 className="text-lg font-bold">Exercícios</h3>

          <div className="space-y-3">
            {treino.exercicios?.map((ex, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">

                <h4 className="font-semibold">{ex.nome}</h4>

                <p className="text-sm text-gray-700">
                  Séries: {ex.series || "-"} <br />
                  Repetições: {ex.repeticoes || "-"} <br />
                  Descanso: {ex.descanso ? `${ex.descanso}s` : "-"}
                </p>

                {ex.observacoes && (
                  <p className="mt-1 text-sm text-gray-600 italic">{ex.observacoes}</p>
                )}
              </div>
            ))}
          </div>
        </div>

      </main>

      <BottomNav />
    </div>
  );
};

export default TreinoDetalhes;
