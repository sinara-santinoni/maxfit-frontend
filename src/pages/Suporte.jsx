// src/pages/Suporte.jsx
import { useState, useEffect } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { suporteService } from "../services/api";

const Suporte = () => {
  const [psicologos, setPsicologos] = useState([]);
  const [nutricionistas, setNutricionistas] = useState([]);
  const [tutoriais, setTutoriais] = useState([]);
  const [dicas, setDicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState("psicologico");

  useEffect(() => {
    carregarSuportes();
  }, []);

  const carregarSuportes = async () => {
    try {
      setLoading(true);

      const [psi, nutri, tuts, tips] = await Promise.all([
        suporteService.listarPsicologos(),
        suporteService.listarNutricionistas(),
        suporteService.listarTutoriais(),
        suporteService.listarDicas(),
      ]);

      setPsicologos(psi || []);
      setNutricionistas(nutri || []);
      setTutoriais(tuts || []);
      setDicas(tips || []);
    } catch (error) {
      console.error("Erro ao carregar dados de suporte:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderProfissionalCard = (prof) => (
    <div
      key={prof.id}
      className="bg-white rounded-2xl shadow-md p-4 flex gap-3 items-center mb-4"
    >
      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
        {prof.emoji || "👩‍⚕️"}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{prof.nome}</h3>
        <p className="text-sm text-gray-500">{prof.especialidade}</p>
        {prof.cidade && (
          <p className="text-xs text-gray-400 mt-1">
            📍 {prof.cidade}{prof.estado ? `, ${prof.estado}` : ""}
          </p>
        )}
        {prof.telefone && (
          <p className="text-xs text-gray-500 mt-1">📞 {prof.telefone}</p>
        )}
        {prof.email && (
          <p className="text-xs text-blue-600 mt-1">{prof.email}</p>
        )}
      </div>
    </div>
  );

  const renderTutorialCard = (item) => (
    <div
      key={item.id}
      className="bg-white rounded-2xl shadow-md p-4 mb-4"
    >
      <h3 className="font-semibold text-gray-800 mb-1">{item.titulo}</h3>
      <p className="text-sm text-gray-600 mb-2">{item.descricao}</p>
      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-600 underline"
        >
          Assistir / Ler
        </a>
      )}
    </div>
  );

  const renderDicaCard = (item) => (
    <div
      key={item.id}
      className="bg-white rounded-2xl shadow-md p-4 mb-4"
    >
      <h3 className="font-semibold text-gray-800 mb-1">💡 {item.titulo}</h3>
      <p className="text-sm text-gray-600">{item.texto}</p>
    </div>
  );

  const renderConteudo = () => {
    if (loading) {
      return (
        <p className="text-center text-gray-500 mt-6">
          Carregando suporte...
        </p>
      );
    }

    if (abaSelecionada === "psicologico") {
      return (
        <>
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 mb-4">
            <p className="font-semibold text-pink-700 mb-1">
              🧠 Cuide da sua saúde mental
            </p>
            <p className="text-sm text-pink-700/80">
              Entre em contato com nossos profissionais para apoio emocional.
            </p>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            {psicologos.length} profissional(is) encontrado(s) na sua região
          </p>

          {psicologos.length === 0 && (
            <p className="text-sm text-gray-500">
              Ainda não há psicólogos cadastrados.
            </p>
          )}

          {psicologos.map(renderProfissionalCard)}
        </>
      );
    }

    if (abaSelecionada === "nutricional") {
      return (
        <>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4">
            <p className="font-semibold text-green-700 mb-1">
              🥗 Suporte nutricional
            </p>
            <p className="text-sm text-green-700/80">
              Conte com nossos profissionais para orientar sua alimentação.
            </p>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            {nutricionistas.length} profissional(is) encontrado(s) na sua região
          </p>

          {nutricionistas.length === 0 && (
            <p className="text-sm text-gray-500">
              Ainda não há nutricionistas cadastrados.
            </p>
          )}

          {nutricionistas.map(renderProfissionalCard)}
        </>
      );
    }

    if (abaSelecionada === "tutoriais") {
      return (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
            <p className="font-semibold text-blue-700 mb-1">
              🎓 Tutoriais
            </p>
            <p className="text-sm text-blue-700/80">
              Aprenda a usar o MaxFit e tire dúvidas sobre treinos e recursos.
            </p>
          </div>

          {tutoriais.length === 0 && (
            <p className="text-sm text-gray-500">
              Nenhum tutorial disponível no momento.
            </p>
          )}

          {tutoriais.map(renderTutorialCard)}
        </>
      );
    }

    // aba "dicas"
    return (
      <>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4">
          <p className="font-semibold text-yellow-700 mb-1">
            💡 Dicas rápidas
          </p>
          <p className="text-sm text-yellow-700/80">
            Pequenas ações diárias geram grandes resultados ao longo do tempo.
          </p>
        </div>

        {dicas.length === 0 && (
          <p className="text-sm text-gray-500">
            Nenhuma dica cadastrada ainda.
          </p>
        )}

        {dicas.map(renderDicaCard)}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header titulo="Suporte" />

      <main className="flex-1 pb-24">
        <section className="max-w-xl mx-auto pt-4 pb-6 px-4">
          {/* TÍTULO / INTRO */}
          <h2 className="text-sm text-gray-500 mb-2">
            Precisa de ajuda? Escolha o tipo de suporte:
          </h2>

          {/* ABAS EM COLUNA */}
          <div className="flex flex-col gap-3 mt-2">
            <button
              onClick={() => setAbaSelecionada("psicologico")}
              className={`w-full py-3 rounded-xl font-semibold shadow-sm border text-left px-4
                ${
                  abaSelecionada === "psicologico"
                    ? "bg-pink-100 text-pink-600 border-pink-300"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
            >
              🧠 Psicológico
            </button>

            <button
              onClick={() => setAbaSelecionada("nutricional")}
              className={`w-full py-3 rounded-xl font-semibold shadow-sm border text-left px-4
                ${
                  abaSelecionada === "nutricional"
                    ? "bg-green-100 text-green-600 border-green-300"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
            >
              🥗 Nutricional
            </button>

            <button
              onClick={() => setAbaSelecionada("tutoriais")}
              className={`w-full py-3 rounded-xl font-semibold shadow-sm border text-left px-4
                ${
                  abaSelecionada === "tutoriais"
                    ? "bg-blue-100 text-blue-600 border-blue-300"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
            >
              🎓 Tutoriais
            </button>

            <button
              onClick={() => setAbaSelecionada("dicas")}
              className={`w-full py-3 rounded-xl font-semibold shadow-sm border text-left px-4
                ${
                  abaSelecionada === "dicas"
                    ? "bg-yellow-100 text-yellow-600 border-yellow-300"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
            >
              💡 Dicas
            </button>
          </div>

          {/* CONTEÚDO DA ABA SELECIONADA */}
          <div className="mt-6">{renderConteudo()}</div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Suporte;
