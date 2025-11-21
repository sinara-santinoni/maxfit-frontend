import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { alunoPersonalService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdicionarAluno = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vinculando, setVinculando] = useState(null);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  // ============================================
  // CARREGAR ALUNOS DISPONÍVEIS
  // ============================================
  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true);
        const alunos = await alunoPersonalService.listarTodos();
        setAlunosDisponiveis(alunos || []);
      } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        setErro('Erro ao carregar lista de alunos.');
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, []);

  // ============================================
  // VINCULAR ALUNO AO PERSONAL
  // ============================================
  const handleVincularAluno = async (alunoId) => {
    try {
      setVinculando(alunoId);
      setErro('');

      await alunoPersonalService.vincular(user.id, alunoId);

      alert("🎉 Aluno vinculado com sucesso!");

      // Remove aluno da lista
      setAlunosDisponiveis((prev) => prev.filter((a) => a.id !== alunoId));
    } catch (error) {
      console.error('Erro ao vincular aluno:', error);
      setErro('Erro ao vincular aluno. Tente novamente.');
    } finally {
      setVinculando(null);
    }
  };

  // ============================================
  // FILTRO DE BUSCA
  // ============================================
  const alunosFiltrados = alunosDisponiveis.filter((aluno) =>
    aluno.nome.toLowerCase().includes(busca.toLowerCase()) ||
    aluno.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Adicionar Aluno" />

      <main className="pt-20 px-4 max-w-md mx-auto">
        
        <button
          onClick={() => navigate('/home-personal')}
          className="mb-4 text-primary hover:text-orange-600 font-semibold flex items-center gap-2"
        >
          ← Voltar
        </button>

        {/* Campo de busca */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar aluno por nome ou email..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-field"
          />
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {erro}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {!loading && alunosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">👥</p>
            <p className="text-gray-600 mb-2">
              {busca ? 'Nenhum aluno encontrado com essa busca' 
                     : 'Nenhum aluno disponível no momento'}
            </p>
            <p className="text-sm text-gray-500">
              Todos os alunos já estão vinculados a algum personal
            </p>
          </div>
        )}

        {!loading && alunosFiltrados.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              {alunosFiltrados.length} aluno(s) disponível(is)
            </p>

            {alunosFiltrados.map((aluno) => (
              <div
                key={aluno.id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {aluno.nome.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-dark text-base truncate">
                      {aluno.nome}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {aluno.email}
                    </p>
                    {aluno.cidade && (
                      <p className="text-xs text-gray-500 mt-1">📍 {aluno.cidade}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleVincularAluno(aluno.id)}
                    disabled={vinculando === aluno.id}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 text-sm"
                  >
                    {vinculando === aluno.id ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Vinculando...
                      </span>
                    ) : (
                      '+ Adicionar'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default AdicionarAluno;
