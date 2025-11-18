import { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import CardTreino from '../components/CardTreino';
import { treinoService } from '../services/api';

/**
 * Página de listagem de treinos do aluno
 * Mostra todos os treinos atribuídos pelo personal
 */
const TreinosAluno = () => {
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Buscar treinos ao carregar a página
  useEffect(() => {
    carregarTreinos();
  }, []);

  const carregarTreinos = async () => {
    try {
      setLoading(true);
      const data = await treinoService.listarTreinosAluno();
      setTreinos(data);
    } catch (err) {
      console.error('Erro ao carregar treinos:', err);
      setError('Não foi possível carregar os treinos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <Header title="Meus Treinos" />

      {/* Conteúdo principal */}
      <main className="pt-20 px-4 max-w-md mx-auto">
        {/* Filtros rápidos */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap">
            Todos
          </button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border border-gray-300">
            Segunda
          </button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border border-gray-300">
            Terça
          </button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border border-gray-300">
            Quarta
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Lista de treinos */}
        {!loading && !error && treinos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">🏋️</p>
            <p className="text-gray-600 mb-2">Nenhum treino encontrado</p>
            <p className="text-sm text-gray-500">
              Entre em contato com seu personal para receber treinos
            </p>
          </div>
        )}

        {!loading && !error && treinos.length > 0 && (
          <div className="space-y-4">
            {treinos.map((treino) => (
              <CardTreino key={treino.id} treino={treino} />
            ))}
          </div>
        )}
      </main>

      {/* Navegação inferior */}
      <BottomNav />
    </div>
  );
};

export default TreinosAluno;