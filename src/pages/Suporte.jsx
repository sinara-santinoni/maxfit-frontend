import { useState, useEffect } from "react";
import { suporteService } from "../services/api";

/**
 * Página de Suporte
 * Oferece suporte psicológico, nutricional, tutoriais e dicas
 */
const Suporte = () => {
  const [psicologos, setPsicologos] = useState([]);
  const [nutricionistas, setNutricionistas] = useState([]);
  const [tutoriais, setTutoriais] = useState([]);
  const [dicas, setDicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState("psicologico");
  const [dicaSelecionada, setDicaSelecionada] = useState(null);
  const [cidadeUsuario, setCidadeUsuario] = useState("Florianópolis"); // Pode vir do contexto/localStorage

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);

      // Carrega todos os dados em paralelo
      const [psi, nutri, tut, dic] = await Promise.all([
        suporteService.listarPsicologos(cidadeUsuario),
        suporteService.listarNutricionistas(cidadeUsuario),
        suporteService.listarTutoriais(),
        suporteService.listarDicas(),
      ]);

      setPsicologos(psi);
      setNutricionistas(nutri);
      setTutoriais(tut);
      setDicas(dic);
    } catch (error) {
      console.error("Erro ao carregar dados de suporte:", error);
      // Em caso de erro, usa dados mockados
      carregarDadosMockados();
    } finally {
      setLoading(false);
    }
  };

  // Fallback com dados mockados caso a API falhe
  const carregarDadosMockados = () => {
    setPsicologos([
      {
        id: 1,
        nome: "Dra. Maria Silva",
        especialidade: "Psicologia Clínica",
        cidade: "Florianópolis, SC",
        telefone: "(48) 99999-1111",
        email: "maria.silva@email.com",
      },
    ]);

    setNutricionistas([
      {
        id: 1,
        nome: "Dra. Ana Costa",
        especialidade: "Nutrição Esportiva",
        cidade: "Florianópolis, SC",
        telefone: "(48) 99999-3333",
        email: "ana.costa@email.com",
      },
    ]);

    setTutoriais([
      {
        id: 1,
        titulo: "Como fazer supino corretamente",
        descricao: "Técnica correta e erros comuns",
        url: "https://www.youtube.com/watch?v=rT7DgCr-3pg",
        thumbnail: "🎥",
      },
      {
        id: 2,
        titulo: "Agachamento livre: guia completo",
        descricao: "Passo a passo para iniciantes",
        url: "https://www.youtube.com/watch?v=ultWZbUMPL8",
        thumbnail: "🎥",
      },
    ]);

    setDicas([
      {
        id: 1,
        titulo: "A importância da hidratação",
        descricao: "Beber água antes, durante e após o treino é essencial.",
        categoria: "Saúde",
        conteudo: "A hidratação adequada é crucial para o desempenho físico.",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg fixed top-0 w-full z-40">
        <h1 className="text-xl font-bold text-center">Suporte</h1>
      </div>

      <main className="pt-20 px-4 max-w-md mx-auto">
        {/* Abas */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["psicologico", "nutricional", "tutoriais", "dicas"].map((aba) => (
            <button
              key={aba}
              onClick={() => setAbaSelecionada(aba)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                abaSelecionada === aba
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              {aba === "psicologico" && "🧠 Psicológico"}
              {aba === "nutricional" && "🥗 Nutricional"}
              {aba === "tutoriais" && "🎥 Tutoriais"}
              {aba === "dicas" && "💡 Dicas"}
            </button>
          ))}
        </div>

        {/* ==== CONTEÚDOS ==== */}

        {/* Suporte Psicológico */}
        {abaSelecionada === "psicologico" && (
          <div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-purple-900 mb-2">
                🧠 Cuide da sua saúde mental
              </h3>
              <p className="text-sm text-purple-800">
                Entre em contato com nossos profissionais para apoio emocional.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {psicologos.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">
                    Nenhum profissional disponível na sua região
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      {psicologos.length}{" "}
                      {psicologos.length === 1
                        ? "profissional encontrado"
                        : "profissionais encontrados"}{" "}
                      na sua região
                    </p>
                    {psicologos.map((psicologo) => (
                      <div
                        key={psicologo.id}
                        className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                            👨‍⚕️
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-lg">
                              {psicologo.nome}
                            </h4>
                            <p className="text-sm text-purple-600 font-semibold mb-1">
                              {psicologo.especialidade}
                            </p>
                            <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                              📍 {psicologo.cidade}
                            </p>

                            <div className="flex flex-col gap-2 text-sm">
                              {psicologo.telefone && (
                                <a
                                  href={`tel:${psicologo.telefone}`}
                                  className="text-blue-600 hover:underline flex items-center gap-2"
                                >
                                  📞 {psicologo.telefone}
                                </a>
                              )}

                              {psicologo.email && (
                                <a
                                  href={`mailto:${psicologo.email}`}
                                  className="text-blue-600 hover:underline flex items-center gap-2 truncate"
                                >
                                  ✉️ {psicologo.email}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Suporte Nutricional */}
        {abaSelecionada === "nutricional" && (
          <div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-green-900 mb-2">
                🥗 Alimentação equilibrada
              </h3>
              <p className="text-sm text-green-800">
                Fale com nossos nutricionistas para otimizar sua dieta.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {nutricionistas.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">
                    Nenhum profissional disponível na sua região
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      {nutricionistas.length}{" "}
                      {nutricionistas.length === 1
                        ? "profissional encontrado"
                        : "profissionais encontrados"}{" "}
                      na sua região
                    </p>
                    {nutricionistas.map((nutricionista) => (
                      <div
                        key={nutricionista.id}
                        className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                            👩‍⚕️
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-lg">
                              {nutricionista.nome}
                            </h4>
                            <p className="text-sm text-green-600 font-semibold mb-1">
                              {nutricionista.especialidade}
                            </p>
                            <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                              📍 {nutricionista.cidade}
                            </p>

                            <div className="flex flex-col gap-2 text-sm">
                              {nutricionista.telefone && (
                                <a
                                  href={`tel:${nutricionista.telefone}`}
                                  className="text-blue-600 hover:underline flex items-center gap-2"
                                >
                                  📞 {nutricionista.telefone}
                                </a>
                              )}

                              {nutricionista.email && (
                                <a
                                  href={`mailto:${nutricionista.email}`}
                                  className="text-blue-600 hover:underline flex items-center gap-2 truncate"
                                >
                                  ✉️ {nutricionista.email}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tutoriais */}
        {abaSelecionada === "tutoriais" && (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-blue-900 mb-2">
                🎥 Aprenda as técnicas
              </h3>
              <p className="text-sm text-blue-800">
                Vídeos educativos para melhorar a execução.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {tutoriais.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">
                    Nenhum tutorial disponível no momento
                  </p>
                ) : (
                  tutoriais.map((tutorial) => (
                    <div
                      key={tutorial.id}
                      className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-red-100 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                          {tutorial.thumbnail}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">
                            {tutorial.titulo}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {tutorial.descricao}
                          </p>

                          <a
                            href={tutorial.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                          >
                            Assistir vídeo →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Dicas */}
        {abaSelecionada === "dicas" && (
          <div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-yellow-900 mb-2">
                💡 Dicas e Artigos
              </h3>
              <p className="text-sm text-yellow-800">
                Conteúdos educativos para melhorar seus resultados.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {dicas.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">
                    Nenhuma dica disponível no momento
                  </p>
                ) : (
                  dicas.map((dica) => (
                    <div
                      key={dica.id}
                      className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-900 flex-1">
                          {dica.titulo}
                        </h4>
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold ml-2 whitespace-nowrap">
                          {dica.categoria}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">
                        {dica.descricao}
                      </p>

                      <button
                        onClick={() => setDicaSelecionada(dica)}
                        className="text-blue-600 text-sm font-semibold hover:underline"
                      >
                        Ler mais →
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Modal de Dica Completa */}
            {dicaSelecionada && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={() => setDicaSelecionada(null)}
              >
                <div
                  className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 bg-white border-b p-4 flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {dicaSelecionada.titulo}
                      </h3>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
                        {dicaSelecionada.categoria}
                      </span>
                    </div>
                    <button
                      onClick={() => setDicaSelecionada(null)}
                      className="text-gray-500 hover:text-gray-700 text-2xl leading-none flex-shrink-0"
                    >
                      ×
                    </button>
                  </div>

                  <div className="p-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {dicaSelecionada.conteudo}
                    </p>
                  </div>

                  <div className="sticky bottom-0 bg-gray-50 border-t p-4">
                    <button
                      onClick={() => setDicaSelecionada(null)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t shadow-lg z-40">
        <div className="flex justify-around items-center py-2">
          <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <span className="text-2xl">🏠</span>
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <span className="text-2xl">💪</span>
            <span className="text-xs">Treinos</span>
          </button>
          <button className="flex flex-col items-center p-2 text-blue-600">
            <span className="text-2xl">❤️</span>
            <span className="text-xs font-semibold">Suporte</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <span className="text-2xl">👤</span>
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Suporte;
