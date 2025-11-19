import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { progressoService, treinoService } from "../services/api";

const MeuProgresso = () => {
  const { user } = useAuth();

  // ------- ESTADOS PROGRESSO FÍSICO -------
  const [progressoFisico, setProgressoFisico] = useState(null);
  const [loadingFisico, setLoadingFisico] = useState(true);

  // ------- ESTADOS PROGRESSO TREINOS -------
  const [progressoTreinos, setProgressoTreinos] = useState(null);
  const [loadingTreinos, setLoadingTreinos] = useState(true);

  // ========================
  // 1. Buscar progresso FÍSICO (personal)
  // ========================
  const carregarProgressoFisico = async () => {
    try {
      const lista = await progressoService.listarProgresso();
      if (lista && lista.length > 0) {
        setProgressoFisico(lista[0]); // registro mais recente
      } else {
        setProgressoFisico(null);
      }
    } catch (err) {
      console.error("Erro ao buscar progresso físico:", err);
      setProgressoFisico(null);
    } finally {
      setLoadingFisico(false);
    }
  };

  // ========================
  // 2. Buscar progresso TREINOS (frequência/aluno)
  // ========================
  const carregarProgressoTreinos = async () => {
    try {
      const dash = await treinoService.dashboard();
      setProgressoTreinos(dash);
    } catch (err) {
      console.error("Erro ao carregar progresso de treinos:", err);
      setProgressoTreinos(null);
    } finally {
      setLoadingTreinos(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    carregarProgressoFisico();
    carregarProgressoTreinos();
  }, [user]);

  // Loading geral
  if (loadingFisico || loadingTreinos) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Meu Progresso" />

      <main className="pt-20 px-4 max-w-md mx-auto space-y-5">

        {/* ==========================
            BLOCO 1 — PROGRESSO FÍSICO
        ========================== */}
        <h1 className="text-xl font-bold text-dark">Progresso Físico</h1>

        {!progressoFisico && (
          <div className="card text-center py-8">
            <p className="text-4xl mb-3">📉</p>
            <p className="text-gray-700 font-semibold">
              Nenhum progresso físico registrado ainda.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Seu personal pode registrar seu peso, medidas e composição corporal.
            </p>
          </div>
        )}

        {progressoFisico && (
          <>
            {/* Peso */}
            <div className="card">
              <h2 className="text-lg font-bold text-dark">Peso Atual</h2>
              <p className="text-3xl font-bold text-primary">
                {progressoFisico.peso} kg
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {new Date(progressoFisico.dataRegistro).toLocaleDateString("pt-BR")}
              </p>
            </div>

            {/* IMC */}
            <div className="card">
              <h2 className="text-lg font-bold text-dark">IMC</h2>
              <p className="text-2xl font-bold text-indigo-600">
                {progressoFisico.imc?.toFixed(1)}
              </p>
              <p className="text-sm text-gray-700">
                {progressoFisico.classificacaoIMC}
              </p>
            </div>

            {/* Medidas */}
            <div className="card">
              <h2 className="text-lg font-bold text-dark mb-2">Medidas Corporais</h2>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>Braços: {progressoFisico.circunferenciaBracos} cm</li>
                <li>Peito: {progressoFisico.circunferenciaPeito} cm</li>
                <li>Cintura: {progressoFisico.circunferenciaCintura} cm</li>
                <li>Quadril: {progressoFisico.circunferenciaQuadril} cm</li>
                <li>Coxas: {progressoFisico.circunferenciaCoxas} cm</li>
                <li>Panturrilhas: {progressoFisico.circunferenciaPanturrilhas} cm</li>
              </ul>
            </div>

            {/* Composição corporal */}
            <div className="card">
              <h2 className="text-lg font-bold text-dark mb-2">
                Composição Corporal
              </h2>
              <p className="text-sm text-gray-700">
                Gordura: <strong>{progressoFisico.percentualGordura}%</strong>
              </p>
              <p className="text-sm text-gray-700">
                Massa Muscular:{" "}
                <strong>{progressoFisico.massaMuscular} kg</strong>
              </p>
            </div>

            {progressoFisico.observacoes && (
              <div className="card">
                <h2 className="text-lg font-bold text-dark mb-2">Observações</h2>
                <p className="text-sm text-gray-700">
                  {progressoFisico.observacoes}
                </p>
              </div>
            )}
          </>
        )}

        {/* ==========================
            BLOCO 2 — PROGRESSO DE TREINOS
        ========================== */}
        <h1 className="text-xl font-bold text-dark mt-4">Progresso nos Treinos</h1>

        {/* Botão para registrar treino do dia */}
        <button
          onClick={async () => {
            try {
              await treinoService.registrarTreino();
              await carregarProgressoTreinos();
              alert("Treino registrado com sucesso! ✅");
            } catch (e) {
              console.error(e);
              alert("Erro ao registrar treino.");
            }
          }}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold shadow hover:bg-orange-600 mb-4"
        >
          Registrar treino de hoje
        </button>

        {!progressoTreinos && (
          <div className="card text-center py-8">
            <p className="text-4xl mb-3">🏋️‍♀️</p>
            <p className="text-gray-700 font-semibold">
              Nenhum treino registrado ainda.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Registre seu primeiro treino para acompanhar sua constância!
            </p>
          </div>
        )}

        {progressoTreinos && (
          <>
            {/* Semana */}
            <div className="card">
              <h2 className="text-lg font-bold text-dark mb-2">
                Resumo da Semana
              </h2>
              <p className="text-sm text-gray-700 mb-2">
                Você treinou{" "}
                <strong>
                  {progressoTreinos.treinosSemana}/
                  {progressoTreinos.metaSemana}
                </strong>{" "}
                vezes essa semana.
              </p>

              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-3 rounded-full"
                  style={{
                    width:
                      progressoTreinos.metaSemana > 0
                        ? `${(progressoTreinos.treinosSemana / progressoTreinos.metaSemana) * 100}%`
                        : "0%",
                  }}
                ></div>
              </div>
            </div>

            {/* Mês */}
            <div className="card">
              <h2 className="text-lg font-bold text-dark mb-2">
                Resumo do Mês
              </h2>
              <p className="text-sm text-gray-700">
                Treinos realizados:{" "}
                <strong>{progressoTreinos.treinosMes}</strong>
              </p>
              <p className="text-sm text-gray-700">
                Meta do mês:{" "}
                <strong>{progressoTreinos.metaMes}</strong>
              </p>
              <p className="text-sm text-dark font-semibold mt-2">
                {progressoTreinos.metaMes > 0
                  ? Math.round(
                      (progressoTreinos.treinosMes /
                        progressoTreinos.metaMes) *
                        100
                    )
                  : 0}
                % da meta atingida 🎯
              </p>
            </div>

            {/* Streak */}
            <div className="card">
              <h2 className="text-lg font-bold text-dark mb-2">
                Dias Seguidos Treinando
              </h2>
              <p className="text-2xl font-bold text-green-600">
                {progressoTreinos.streakDias} dias 🔥
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Mantenha sua sequência para resultados melhores!
              </p>
            </div>

            {/* Últimos treinos */}
            <div className="card">
              <h2 className="text-lg font-bold text-dark mb-3">
                Últimos Treinos
              </h2>
              <ul className="space-y-2 text-sm">
                {progressoTreinos.ultimosTreinos.map((t, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between border-b border-gray-100 pb-1 last:border-b-0"
                  >
                    <div>
                      <p className="font-semibold">{t.data}</p>
                      <p className="text-gray-600">{t.nome}</p>
                    </div>
                    <span
                      className={t.concluido ? "text-green-600" : "text-red-500"}
                    >
                      {t.concluido ? "✅" : "❌"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default MeuProgresso;
