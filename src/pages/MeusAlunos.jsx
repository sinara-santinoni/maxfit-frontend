import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

// 🔄 IMPORTA O SERVICE CORRETO AGORA:
import { alunoPersonalService } from '../services/api';

import { useAuth } from '../context/AuthContext';

const MeusAlunos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  // ============================================
  // BUSCAR ALUNOS VINCULADOS AO PERSONAL
  // ============================================
  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true);
        setErro('');

        // 🔄 AGORA USA O SERVICE CERTO
        const lista = await alunoPersonalService.listarVinculados(user.id);
        setAlunos(lista || []);

      } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        setErro('Erro ao carregar seus alunos');
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, []);

  // ============================================
  // DESVINCULAR ALUNO (BACKEND NÃO SUPORTA)
  // ============================================
  const handleDesvincular = async () => {
    alert("⚠ O backend atual não possui endpoint para desvincular aluno.\n\nEssa funcionalidade está desativada.");
  };

  // ============================================
  // FILTRO DE BUSCA
  // ============================================
  const alunosFiltrados = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(busca.toLowerCase()) ||
    aluno.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Meus Alunos" />

      <main className="pt-20 px-4 max-w-md mx-auto">
        
        {/* Botão adicionar novo aluno */}
        <button
          onClick={() => navigate('/personal/adicionar-aluno')}
          className="btn-primary mb-6"
        >
          + Adicionar Novo Aluno
        </button>

        {/* Campo de busca */}
        {alunos.length > 0 && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Buscar aluno..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="input-field"
            />
          </div>
        )}

        {/* Mensagem de erro */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {erro}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Lista vazia */}
        {!loading && alunos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">👥</p>
            <p className="text-gray-600 mb-2">
              Você ainda não tem alunos vinculados
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Clique no botão acima para adicionar seu primeiro aluno
            </p>
          </div>
        )}

        {/* Lista de alunos */}
        {!loading && alunosFiltrados.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              {alunosFiltrados.length} aluno(s) vinculado(s)
            </p>

            {alunosFiltrados.map((aluno) => (
              <div
                key={aluno.id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  
                  {/* Avatar */}
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {aluno.nome.charAt(0).toUpperCase()}
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-dark text-base">
                      {aluno.nome}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {aluno.email}
                    </p>
                    {aluno.cidade && (
                      <p className="text-xs text-gray-500 mt-1">
                        📍 {aluno.cidade}
                      </p>
                    )}
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/progresso-aluno/${aluno.id}`)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm"
                  >
                    📊 Ver Progresso
                  </button>

                  <button
                    onClick={handleDesvincular}
                    className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold cursor-not-allowed text-sm"
                  >
                    🚫 Indisponível
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Nenhum resultado na busca */}
        {!loading && alunos.length > 0 && alunosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-600">
              Nenhum aluno encontrado com "{busca}"
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default MeusAlunos;
