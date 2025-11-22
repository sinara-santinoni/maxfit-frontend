import { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import CardTreino from '../components/CardTreino';
import { treinoService } from '../services/api';

const TreinosAluno = () => {
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarTreinos();
  }, []);

  const carregarTreinos = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.id) {
        setError("Aluno não encontrado");
        return;
      }

      const data = await treinoService.listarTreinos(user.id);
      setTreinos(data || []);
    } catch (err) {
      console.error("Erro ao carregar treinos:", err);
      setError("Não foi possível carregar os treinos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Meus Treinos" />

      <main className="pt-20 px-4 max-w-md mx-auto">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!loading && treinos.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">🏋️‍♂️</p>
            <p className="text-gray-600">Nenhum treino encontrado.</p>
            <p className="text-sm text-gray-500">Peça ao personal um treino!</p>
          </div>
        )}

        {!loading && treinos.length > 0 && (
          <div className="space-y-4">
            {treinos.map((treino) => (
              <CardTreino key={treino.id} treino={treino} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default TreinosAluno;
