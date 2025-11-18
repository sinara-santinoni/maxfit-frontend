import { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { suporteService } from '../services/api';

/**
 * Página de Suporte
 * Oferece suporte psicológico, nutricional, tutoriais e dicas
 */
const Suporte = () => {
  const [psicologos, setPsicologos] = useState([]);
  const [nutricionistas, setNutricionistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState('psicologico');

  useEffect(() => {
    carregarSuportes();
  }, []);

  const carregarSuportes = async () => {
    try {
      setLoading(true);
      const [psi, nutri] = await Promise.all([
        suporteService.listarPsicologos(),
        suporteService.listarNutricionistas(),
      ]);

      setPsicologos(psi);
      setNutricionistas(nutri);
    } catch (error) {
      console.error('Erro ao carregar suportes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tutoriais (estático por enquanto)
  const tutoriais = [
    {
      id: 1,
      titulo: 'Como fazer supino corretamente',
      descricao: 'Técnica correta e erros comuns',
      url: 'https://youtube.com/watch?v=exemplo1',
      thumbnail: '🎥',
    },
    {
      id: 2,
      titulo: 'Agachamento livre: guia completo',
      descricao: 'Passo a passo para iniciantes',
      url: 'https://youtube.com/watch?v=exemplo2',
      thumbnail: '🎥',
    },
    {
      id: 3,
      titulo: 'Alongamentos pré-treino',
      descricao: 'Prepare seu corpo corretamente',
      url: 'https://youtube.com/watch?v=exemplo3',
      thumbnail: '🎥',
    },
  ];

  const dicas = [
    {
      id: 1,
      titulo: 'A importância da hidratação',
      descricao: 'Beber água antes, durante e após o treino é essencial...',
      categoria: 'Saúde',
    },
    {
      id: 2,
      titulo: 'Como evitar lesões na musculação',
      descricao: 'Dicas de prevenção e cuidados importantes...',
      categoria: 'Segurança',
    },
    {
      id: 3,
      titulo: 'Nutrição pré-treino',
      descricao: 'O que comer antes de treinar para melhor performance...',
      categoria: 'Nutrição',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Suporte" />

      <main className="pt-20 px-4 max-w-md mx-auto">

        {/* Abas */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['psicologico', 'nutricional', 'tutoriais', 'dicas'].map((aba) => (
            <button
              key={aba}
              onClick={() => setAbaSelecionada(aba)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                abaSelecionada === aba
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {aba === 'psicologico' && '🧠 Psicológico'}
              {aba === 'nutricional' && '🥗 Nutricional'}
              {aba === 'tutoriais' && '🎥 Tutoriais'}
              {aba === 'dicas' && '💡 Dicas'}
            </button>
          ))}
        </div>

        {/* ==== CONTEÚDOS ==== */}

        {/* Suporte Psicológico */}
        {abaSelecionada === 'psicologico' && (
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
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {psicologos.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">
                    Nenhum profissional disponível
                  </p>
                ) : (
                  psicologos.map((psicologo) => (
                    <div key={psicologo.id} className="card p-4 bg-white rounded-lg shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl">
                          👨‍⚕️
                        </div>

                        <div className="flex-1">
                          <h4 className="font-bold text-dark">{psicologo.nome}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {psicologo.especialidade}
                          </p>

                          <div className="flex flex-col gap-1 text-sm">
                            {psicologo.telefone && (
                              <a
                                href={`tel:${psicologo.telefone}`}
                                className="text-primary hover:underline"
                              >
                                📞 {psicologo.telefone}
                              </a>
                            )}

                            {psicologo.email && (
                              <a
                                href={`mailto:${psicologo.email}`}
                                className="text-primary hover:underline"
                              >
                                ✉️ {psicologo.email}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Suporte Nutricional */}
        {abaSelecionada === 'nutricional' && (
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
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {nutricionistas.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">
                    Nenhum profissional disponível
                  </p>
                ) : (
                  nutricionistas.map((nutricionista) => (
                    <div key={nutricionista.id} className="card p-4 bg-white rounded-lg shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">
                          👩‍⚕️
                        </div>

                        <div className="flex-1">
                          <h4 className="font-bold text-dark">{nutricionista.nome}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {nutricionista.especialidade}
                          </p>

                          <div className="flex flex-col gap-1 text-sm">
                            {nutricionista.telefone && (
                              <a
                                href={`tel:${nutricionista.telefone}`}
                                className="text-primary hover:underline"
                              >
                                📞 {nutricionista.telefone}
                              </a>
                            )}

                            {nutricionista.email && (
                              <a
                                href={`mailto:${nutricionista.email}`}
                                className="text-primary hover:underline"
                              >
                                ✉️ {nutricionista.email}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Tutoriais */}
        {abaSelecionada === 'tutoriais' && (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-blue-900 mb-2">🎥 Aprenda as técnicas</h3>
              <p className="text-sm text-blue-800">
                Vídeos educativos para melhorar a execução.
              </p>
            </div>

            <div className="space-y-4">
              {tutoriais.map((tutorial) => (
                <div key={tutorial.id} className="card p-4 bg-white rounded-lg shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-red-100 rounded-lg flex items-center justify-center text-4xl">
                      {tutorial.thumbnail}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-dark mb-1">{tutorial.titulo}</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {tutorial.descricao}
                      </p>

                      <a
                        href={tutorial.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-semibold hover:underline"
                      >
                        Assistir vídeo →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dicas */}
        {abaSelecionada === 'dicas' && (
          <div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-yellow-900 mb-2">💡 Dicas e Artigos</h3>
              <p className="text-sm text-yellow-800">
                Conteúdos educativos para melhorar seus resultados.
              </p>
            </div>

            <div className="space-y-4">
              {dicas.map((dica) => (
                <div key={dica.id} className="card p-4 bg-white rounded-lg shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-dark flex-1">{dica.titulo}</h4>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
                      {dica.categoria}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{dica.descricao}</p>

                  <button className="text-primary text-sm font-semibold hover:underline">
                    Ler mais →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <BottomNav />
    </div>
  );
};

export default Suporte;
