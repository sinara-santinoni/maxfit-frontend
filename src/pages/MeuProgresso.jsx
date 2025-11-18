import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // sua API do Render

const MeuProgresso = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progresso, setProgresso] = useState(null);

  // ========================
  // 1. Buscar progresso no backend
  // ========================
  const carregarProgresso = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/progresso/${user.id}`);
      const lista = response.data.data; // vem dentro do ApiResponse

      if (lista.length > 0) {
        setProgresso(lista[0]); // mais recente primeiro
      } else {
        setProgresso(null);
      }
    } catch (err) {
      console.error("Erro ao buscar progresso:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProgresso();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Meu Progresso" />

      <main className="pt-20 px-4 max-w-md mx-auto space-y-5">
        {/* Se não tiver progresso ainda */}
        {!progresso && (
          <div className="card text-center py-8">
            <p className="text-4xl mb-3">📉</p>
            <p className="text-gray-700 font-semibold">
              Nenhum progresso registrado ainda.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Registre seu primeiro progresso no Diário ou com seu Personal!
            </p>
          </div>
        )}

        {/* ============================
              EXIBIR PROGRESSO REAL
        ============================ */}
        {progresso && (
          <>
            {/* Peso */}
            <div className="card">
              <h2 className="text-lg font-bold mb-1 text-dark">Peso Atual</h2>
              <p className="text-3xl font-bold text-primary">{progresso.peso} kg</p>

              <p className="text-sm text-gray-600 mt-2">
                Registrado em:{" "}
                {new Date(progresso.dataRegistro).toLocaleDateString("pt-BR")}
              </p>
            </div>

            {/* IMC */}
            <div className="card">
              <h2 className="text-lg font-bold text-dark mb-2">IMC</h2>

              <p className="text-2xl font-bold text-indigo-600">
                {progresso.imc?.toFixed(1)}
              </p>

              <p className="text-sm text-gray-700 mt-1">
                {progresso.classificacaoIMC}
              </p>
            </div>

            {/* Medidas */}
            <div className="card">
              <h2 className="text-lg font-bold mb-2 text-dark">Medidas Corporais</h2>

              <ul className="text-sm text-gray-700 space-y-1">
                <li>Braços: {progresso.circunferenciaBracos} cm</li>
                <li>Peito: {progresso.circunferenciaPeito} cm</li>
                <li>Cintura: {progresso.circunferenciaCintura} cm</li>
                <li>Quadril: {progresso.circunferenciaQuadril} cm</li>
                <li>Coxas: {progresso.circunferenciaCoxas} cm</li>
                <li>Panturrilhas: {progresso.circunferenciaPanturrilhas} cm</li>
              </ul>
            </div>

            {/* Gordura & Massa */}
            <div className="card">
              <h2 className="text-lg font-bold text-dark mb-2">Composição Corporal</h2>

              <p className="text-sm text-gray-700">
                Percentual de gordura:{" "}
                <strong>{progresso.percentualGordura}%</strong>
              </p>

              <p className="text-sm text-gray-700">
                Massa muscular:{" "}
                <strong>{progresso.massaMuscular} kg</strong>
              </p>
            </div>

            {/* Observações */}
            {progresso.observacoes && (
              <div className="card">
                <h2 className="text-lg font-bold text-dark mb-2">Observações</h2>
                <p className="text-sm text-gray-700">{progresso.observacoes}</p>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default MeuProgresso;
